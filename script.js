(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Появление секций при скролле ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- Анимированные цифры в блоке .stats ---------- */
  var counters = document.querySelectorAll(".stats [data-count-to]");
  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) { setCount(el, parseFloat(el.getAttribute("data-count-to"))); });
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  function setCount(el, value) {
    var suffix = el.getAttribute("data-count-suffix") || "";
    el.textContent = value + suffix;
  }

  function animateCount(el) {
    var to = parseFloat(el.getAttribute("data-count-to"));
    var from = parseFloat(el.getAttribute("data-count-from") || "0");
    var suffix = el.getAttribute("data-count-suffix") || "";
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(from + (to - from) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Копирование email в один клик ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var text = el.getAttribute("data-copy");
      if (!text || !navigator.clipboard) return;
      e.preventDefault();
      navigator.clipboard.writeText(text).then(function () {
        showCopyToast(el, "Скопировано ✓");
      }).catch(function () {
        window.location.href = el.getAttribute("href");
      });
    });
  });

  function showCopyToast(el, message) {
    var toast = document.createElement("span");
    toast.className = "copy-toast";
    toast.textContent = message;
    el.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add("is-visible"); });
    setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () { toast.remove(); }, 300);
    }, 1400);
  }
})();
