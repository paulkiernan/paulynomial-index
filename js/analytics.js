// PostHog product analytics for paulynomial.com, shared by index.html and the
// 404 page. Load it as a plain (non-deferred) <script> so the posthog stub
// exists before any other script calls posthog.capture().
//
// Cookieless: no cookies or browser storage, so no consent banner is needed.
// Cookieless mode must also be enabled in the PostHog project settings, or
// these events are dropped.

/* eslint-disable */
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
/* eslint-enable */

(function () {
  // Project 730046 (US Cloud). phc_ keys are public by design.
  posthog.init('phc_km8esoqHGhT9RUi4nSaoj3oBSs4gUQfMo4Pfo8YZGYBK', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30',
    cookieless_mode: 'always',
    disable_session_recording: true,
    // Uncaught errors and unhandled rejections land in Error tracking
    capture_exceptions: true,
    // LCP/INP/CLS/FCP for the Web vitals tab: the WebGL flock is the heavy part
    capture_performance: { web_vitals: true },
    // Click maps for the toolbar heatmap (no session recording needed)
    capture_heatmaps: true,
  });

  // Attached to every event so dashboards can isolate this site even if the
  // PostHog project also receives events from other apps.
  posthog.register({
    site: 'paulynomial.com',
    page_type: document.documentElement.dataset.pageType || 'home',
  });

  // Named click event for every link on the page. Autocapture records these
  // too, but a named event with clean properties is far easier to chart.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var section = a.closest('.modal-links') ? 'card'
      : a.closest('#whats-this-panel') ? 'about'
      : 'other';
    posthog.capture('link_clicked', {
      link: a.textContent.trim().toLowerCase(),
      href: a.href,
      section: section,
      outbound: a.host !== window.location.host,
    });
  }, true);
})();
