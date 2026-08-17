/* ============================================================================
   Eleczo homepage body prototype — behaviour

   Three things only, all of them honest:
     1. Identifier normalisation, demonstrating audit §3.2.3 as a real function
     2. Governance overlay toggle
     3. Theme toggle

   Nothing here simulates a catalogue, a price, a stock level or a submitted
   enquiry. BC-06 prohibits fake functionality, and a prototype that appears to
   return results is exactly the failure it describes.
   ========================================================================== */
(function () {
  'use strict'

  /* ---------------------------------------------------------------------
     Identifier normalisation.

     Trade buyers enter manufacturer part numbers in whatever form the
     datasheet, the label or the previous invoice used. "5SL6 316-7",
     "5sl63167" and "5SL6-316-7" are the same part. Audit §3.2.3 records
     fault tolerance as a functional requirement, not a search-tuning nicety.
     -------------------------------------------------------------------- */

  function normaliseIdentifier(raw) {
    return raw.toUpperCase().replace(/[\s\-_./]/g, '')
  }

  /** Looks like a part number rather than a descriptive phrase? */
  function looksLikeIdentifier(normalised) {
    return (
      normalised.length >= 4 &&
      /\d/.test(normalised) &&
      /^[A-Z0-9]+$/.test(normalised) &&
      !/^\d+$/.test(normalised)
    )
  }

  /** Pull structured spec tokens out of a descriptive query. */
  function extractSpecs(raw) {
    const specs = []
    const patterns = [
      [/(\d+(?:\.\d+)?)\s*A\b/gi,          (m) => `Current rating: ${m[1]} A`],
      [/(\d+(?:\.\d+)?)\s*mA\b/gi,         (m) => `Sensitivity: ${m[1]} mA`],
      [/(\d+(?:\.\d+)?)\s*kA\b/gi,         (m) => `Breaking capacity: ${m[1]} kA`],
      [/\b([1-4])\s*P\b/gi,                (m) => `Poles: ${m[1]}P`],
      [/\b(\d+(?:\.\d+)?)\s*mm2?\b/gi,     (m) => `Conductor size: ${m[1]} mm²`],
      [/\b(\d+)\s*V\b/gi,                  (m) => `Voltage: ${m[1]} V`],
      [/\b(MCB|MCCB|RCCB|RCBO|ELCB|SPD|PLC|HMI|VFD)\b/gi, (m) => `Product type: ${m[1].toUpperCase()}`],
      [/\bcurve\s*([BCDK])\b/gi,           (m) => `Trip curve: ${m[1].toUpperCase()}`],
    ]

    for (const [pattern, label] of patterns) {
      let match
      pattern.lastIndex = 0
      while ((match = pattern.exec(raw)) !== null) {
        const text = label(match)
        if (!specs.includes(text)) specs.push(text)
      }
    }
    return specs
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ))
  }

  const form = document.getElementById('idsearch')
  const input = document.getElementById('idsearch-input')
  const result = document.getElementById('idsearch-result')

  if (form && input && result) {
    form.addEventListener('submit', function (event) {
      event.preventDefault()

      const raw = input.value.trim()
      if (!raw) {
        result.innerHTML = '<b>Enter a part number or a specification to see how it would be handled.</b>'
        return
      }

      const normalised = normaliseIdentifier(raw)
      const isIdentifier = looksLikeIdentifier(normalised)
      const specs = extractSpecs(raw)

      let html = ''

      if (isIdentifier) {
        html +=
          '<b>Read as a known-item query (INT-1).</b><br>' +
          'Entered <code>' + escapeHtml(raw) + '</code> &rarr; ' +
          'normalised to <code>' + escapeHtml(normalised) + '</code>.<br>' +
          'Spacing, hyphens, dots and case are stripped before matching, so the ' +
          'three common ways of writing the same part all resolve together.'
      } else if (specs.length) {
        html +=
          '<b>Read as a known-specification query (INT-2).</b><br>' +
          'Parsed attributes: <br>&nbsp;&nbsp;• ' +
          specs.map(escapeHtml).join('<br>&nbsp;&nbsp;• ')
      } else {
        html +=
          '<b>Read as a descriptive query.</b><br>' +
          'No identifier or structured attribute detected in ' +
          '<code>' + escapeHtml(raw) + '</code>, so this would route to ordinary ' +
          'keyword search — and be logged if it returns nothing.'
      }

      html +=
        '<br><br><b>Prototype stops here.</b> No results are shown, because none exist: ' +
        'the catalogue export (T-14) has not been supplied and inventing matches would be ' +
        'fake functionality. In build, this hands off to global search — which is itself ' +
        'a live scope question (DS-08). Zero-result queries are logged from day one (§3.2.5).'

      result.innerHTML = html
    })
  }

  /* ------------------------------------------------- governance overlay ---- */

  const overlayToggle = document.getElementById('overlay-toggle')
  if (overlayToggle) {
    overlayToggle.addEventListener('click', function () {
      const on = document.body.classList.toggle('gov-on')
      overlayToggle.setAttribute('aria-pressed', String(on))
      overlayToggle.textContent = on ? 'Hide governance overlay' : 'Show governance overlay'
    })
  }

  /* ------------------------------------------------------------- theme ---- */

  const themeToggle = document.getElementById('theme-toggle')
  const themeIcon = document.getElementById('theme-icon')

  if (themeToggle) {
    const stored = (function () {
      try { return localStorage.getItem('eleczo-proto-theme') } catch { return null }
    })()

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    let theme = stored || (systemDark ? 'dark' : 'light')

    function apply(next) {
      theme = next
      document.documentElement.setAttribute('data-theme', next)
      themeToggle.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      )
      if (themeIcon) themeIcon.textContent = next === 'dark' ? '☀' : '◐'
      try { localStorage.setItem('eleczo-proto-theme', next) } catch { /* private mode */ }
    }

    apply(theme)
    themeToggle.addEventListener('click', function () {
      apply(theme === 'dark' ? 'light' : 'dark')
    })
  }

  /* ------------------------------------------------- inert blocked actions - */

  document.querySelectorAll('[data-blocked-action]').forEach(function (button) {
    button.addEventListener('click', function () {
      window.alert(
        'Not wired up, deliberately.\n\n' +
        'DS-12: no RFQ owner, routing rule or response-time commitment has been ' +
        'confirmed. A quote form with no workflow behind it collects intent from ' +
        'your highest-value buyers and drops it, which is worse than not offering it.\n\n' +
        'DS-01: native quoting is an Adobe Commerce feature. On Magento Open Source ' +
        'it must be built or bought — and the platform itself is still unverified (RISK-03).',
      )
    })
  })
})()
