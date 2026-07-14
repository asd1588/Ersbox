import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCardComponent = ({
  avatarUrl = '',
  iconUrl = '',
  grainUrl = '',
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Your Name',
  title = 'Software Engineer',
  handle = 'yourhandle',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;
    let rafId = null, running = false, lastTs = 0;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    const DEFAULT_TAU = 0.14, INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current, wrap = wrapRef.current;
      if (!shell || !wrap) return;
      const width = shell.clientWidth || 1, height = shell.clientHeight || 1;
      const percentX = clamp((100 / width) * x), percentY = clamp((100 / height) * y);
      const centerX = percentX - 50, centerY = percentY - 50;
      const properties = {
        '--pointer-x': percentX + '%', '--pointer-y': percentY + '%',
        '--background-x': adjust(percentX, 0, 100, 35, 65) + '%',
        '--background-y': adjust(percentY, 0, 100, 35, 65) + '%',
        '--pointer-from-center': '' + clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1),
        '--pointer-from-top': '' + (percentY / 100), '--pointer-from-left': '' + (percentX / 100),
        '--rotate-x': round(-(centerX / 5)) + 'deg', '--rotate-y': round(centerY / 4) + 'deg'
      };
      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = function(ts) {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000; lastTs = ts;
      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);
      currentX += (targetX - currentX) * k; currentY += (targetY - currentY) * k;
      setVarsFromXY(currentX, currentY);
      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false; lastTs = 0;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    };

    const start = function() { if (running) return; running = true; lastTs = 0; rafId = requestAnimationFrame(step); };
    return {
      setImmediate: function(x, y) { currentX = x; currentY = y; setVarsFromXY(currentX, currentY); },
      setTarget: function(x, y) { targetX = x; targetY = y; start(); },
      toCenter: function() { const shell = shellRef.current; if (!shell) return; this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2); },
      beginInitial: function(durationMs) { initialUntil = performance.now() + durationMs; start(); },
      getCurrent: function() { return { x: currentX, y: currentY, tx: targetX, ty: targetY }; },
      cancel: function() { if (rafId) cancelAnimationFrame(rafId); rafId = null; running = false; lastTs = 0; }
    };
  }, [enableTilt]);

  const getOffsets = function(evt, el) {
    var rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  var handlePointerMove = useCallback(function(event) {
    var wrap = wrapRef.current;
    if (!wrap || !tiltEngine) return;
    var offsets = getOffsets(event, wrap);
    tiltEngine.setTarget(offsets.x, offsets.y);
  }, [tiltEngine]);

  var handlePointerEnter = useCallback(function(event) {
    var wrap = wrapRef.current;
    if (!wrap || !tiltEngine) return;
    wrap.classList.add('active'); shell.classList.add('entering');
    if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
    enterTimerRef.current = window.setTimeout(function() { shell.classList.remove('entering'); }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);
    var offsets = getOffsets(event, shell);
    tiltEngine.setTarget(offsets.x, offsets.y);
  }, [tiltEngine]);

  var handlePointerLeave = useCallback(function() {
    var wrap = wrapRef.current;
    if (!wrap || !tiltEngine) return;
    tiltEngine.toCenter();
    var checkSettle = function() {
      var state = tiltEngine.getCurrent();
      if (Math.hypot(state.tx - state.x, state.ty - state.y) < 0.6) {
        shell.classList.remove('active'); leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  var handleDeviceOrientation = useCallback(function(event) {
    var wrap = wrapRef.current;
    if (!wrap || !tiltEngine) return;
    var beta = event.beta, gamma = event.gamma;
    if (beta == null || gamma == null) return;
    var centerX = wrap.clientWidth / 2, centerY = wrap.clientHeight / 2;
    var x = clamp(centerX + gamma * mobileTiltSensitivity, 0, wrap.clientWidth);
    var y = clamp(centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity, 0, wrap.clientHeight);
    tiltEngine.setTarget(x, y);
  }, [tiltEngine, mobileTiltSensitivity]);

    useEffect(function() {
    if (!enableTilt || !tiltEngine) return;
    var wrap = wrapRef.current;
    if (!wrap) return;

    wrap.addEventListener('pointerenter', handlePointerEnter);
    wrap.addEventListener('pointermove', handlePointerMove);
    wrap.addEventListener('pointerleave', handlePointerLeave);

    var handleClick = function() {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      var anyMotion = window.DeviceMotionEvent;
      if (anyMotion && typeof anyMotion.requestPermission === 'function') {
        anyMotion.requestPermission().then(function(state) {
          if (state === 'granted') window.addEventListener('deviceorientation', handleDeviceOrientation);
        }).catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
    wrap.addEventListener('click', handleClick);

    var initialX = (wrap.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    var initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return function() {
      wrap.removeEventListener('pointerenter', handlePointerEnter);
      wrap.removeEventListener('pointermove', handlePointerMove);
      wrap.removeEventListener('pointerleave', handlePointerLeave);
      wrap.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shellRef.current.classList.remove('entering');
    };
  }, [enableTilt, enableMobileTilt, tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation]);

  var cardStyle = useMemo(function() {
    return {
      '--icon': iconUrl ? 'url(' + iconUrl + ')' : 'none',
      '--grain': grainUrl ? 'url(' + grainUrl + ')' : 'none',
      '--inner-gradient': innerGradient || DEFAULT_INNER_GRADIENT,
      '--behind-glow-color': behindGlowColor || 'rgba(125, 190, 255, 0.67)',
      '--behind-glow-size': behindGlowSize || '50%'
    };
  }, [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  var handleContactClick = useCallback(function() {
    if (onContactClick) onContactClick();
  }, [onContactClick]);

  var wrapperClassName = 'pc-card-wrapper' + (className ? ' ' + className : '');

  return (
    <div ref={wrapRef} className={wrapperClassName} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside" />
          <div className="pc-avatar-wrap">
            <img src={avatarUrl} alt={name + ' avatar'} loading="lazy" onError={function(e) { e.target.style.display = 'none'; }} />
            <div className="pc-avatar-overlay" />
          </div>
          {showUserInfo && (
            <div className="pc-user-info">
              <div className="pc-user-details">
                <div className="pc-mini-avatar">
                  <img src={miniAvatarUrl || avatarUrl} alt={name + ' mini avatar'} loading="lazy" onError={function(e) { e.target.style.opacity = '0.5'; e.target.src = avatarUrl; }} />
                </div>
                <div className="pc-user-text">
                  <div className="pc-handle">@{handle}</div>
                  <div className="pc-status">{status}</div>
                </div>
              </div>
              <button className="pc-contact-btn" onClick={handleContactClick} style={{ pointerEvents: "auto" }} type="button" aria-label={'Contact ' + (name || 'user')}>{contactText}</button>
            </div>
          )}
          <div className="pc-details">
            <h3>{name}</h3>
            <p>{title}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

var ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;





