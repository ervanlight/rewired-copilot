document.addEventListener('DOMContentLoaded', () => {
  // Form & controls
  const form = document.getElementById('listing-form');
  const generateButton = document.getElementById('generate-button');

  // Output elements (6 kartu)
  const outputJudulList = document.getElementById('output-judul-list');
  const outputPortal = document.getElementById('output-portal-content');
  const outputIG = document.getElementById('output-ig-content');
  const outputTiktok = document.getElementById('output-tiktok-content');
  const outputWA = document.getElementById('output-wa-content');
  const outputAudit = document.getElementById('output-audit-content');
  // Langkah 3 container (dashboard) - initially hidden in HTML
  const langkah3Container = document.getElementById('langkah-3');

  // status message area (create if absent)
  let pesanStatus = document.getElementById('pesan-status');
  if (!pesanStatus) {
    pesanStatus = document.createElement('div');
    pesanStatus.id = 'pesan-status';
    pesanStatus.style.margin = '10px 0';
    pesanStatus.style.fontSize = '13px';
    pesanStatus.style.color = '#b91c1c';
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(pesanStatus, container.firstChild);
  }

  const setStatus = (msg = '', isError = true) => {
    pesanStatus.textContent = msg;
    pesanStatus.style.display = msg ? 'block' : 'none';
    pesanStatus.style.color = isError ? '#b91c1c' : '#065f46';
  };

  // Bretel pengaman: prevent form submit -> page reload
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
    });
  }

  const clearChildren = (node) => {
    if (!node) return;
    while (node.firstChild) node.removeChild(node.firstChild);
  };

  const createCopyButton = (text) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.className = 'copy-inline';
    btn.style.marginLeft = '8px';
    btn.addEventListener('click', async () => {
      // Try modern clipboard API then fallback to execCommand
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // fallback: create temporary textarea
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const prev = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => (btn.textContent = prev), 1200);
      } catch (e) {
        console.error('Clipboard copy failed', e);
        setStatus('Gagal menyalin clipboard', true);
      }
    });
    return btn;
  };

  // Parse JSON-in-JSON defensively:
  // 1) await response.json()
  // 2) JSON.parse(responseBody.body) (preferred) with fallbacks
  const parseNestedResponse = (responseBody) => {
    if (!responseBody) return null;

    // If responseBody has property 'body' as string -> parse it
    if (typeof responseBody === 'object' && Object.prototype.hasOwnProperty.call(responseBody, 'body')) {
      const inner = responseBody.body;
      if (typeof inner === 'string') {
        try {
          return JSON.parse(inner);
        } catch (e) {
          // If parsing fails, return the raw string
          return inner;
        }
      }
      // body already an object
      return inner;
    }

    // If responseBody is a string (rare) try parse once
    if (typeof responseBody === 'string') {
      try {
        return JSON.parse(responseBody);
      } catch (e) {
        return responseBody;
      }
    }

    // otherwise return as-is
    return responseBody;
  };

  // Render functions (defensive)
  const renderTitles = (kartu_portal) => {
    clearChildren(outputJudulList);
    if (!outputJudulList) return;

    if (!kartu_portal || typeof kartu_portal !== 'object') {
      const li = document.createElement('li');
      li.textContent = 'kartu_portal tidak tersedia';
      outputJudulList.appendChild(li);
      return;
    }

    const keys = ['judul_1','judul_2','judul_3','judul_4','judul_5'];
    let any = false;
    keys.forEach(k => {
      const v = kartu_portal[k];
      if (v && String(v).trim().length) {
        any = true;
        const li = document.createElement('li');
        // wrapper class for styling dividers and spacing
        li.className = 'output-item';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'space-between';

        const title = document.createElement('p');
        title.textContent = v;
        title.style.flex = '1';
        title.style.margin = '0';
        li.appendChild(title);

        const btn = createCopyButton(v);
        li.appendChild(btn);

        outputJudulList.appendChild(li);
      }
    });

    if (!any) {
      const li = document.createElement('li');
      li.textContent = 'Tidak ditemukan judul_1..judul_5 pada kartu_portal';
      outputJudulList.appendChild(li);
    }
  };

  const setPreSafe = (node, value, fallback = '—') => {
    if (!node) return;
    if (value == null || value === '') {
      node.textContent = fallback;
      return;
    }
    if (typeof value === 'string') {
      node.textContent = value;
    } else {
      try { node.textContent = JSON.stringify(value, null, 2); } catch { node.textContent = String(value); }
    }
  };

  // Helper: escape HTML to safely insert user/model content into innerHTML
  const escapeHtml = (unsafe) => {
    if (unsafe == null) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Main generate handler
  if (generateButton) {
    generateButton.addEventListener('click', async () => {
      setStatus('', false);

      // store previous button text for later restore
      const prevText = generateButton.textContent;

      // Custom required-field validation (IDs in kebab-case)
      const requiredFields = [
        { id: 'tipe-properti', name: 'Tipe Properti' },
        { id: 'target-audiens', name: 'Target Audiens' },
        { id: 'data-teknis', name: 'Data Teknis' },
        { id: 'harga', name: 'Harga' },
        { id: 'fitur-unik', name: 'Fitur Unik' }
      ];

      const emptyFields = [];
      requiredFields.forEach(f => {
        const el = document.getElementById(f.id);
        const val = el && typeof el.value !== 'undefined' ? String(el.value).trim() : '';
        if (!val) {
          emptyFields.push(f.name);
          if (el) el.classList.add('error');
        } else {
          if (el) el.classList.remove('error');
        }
      });

      if (emptyFields.length > 0) {
        alert('Wajib Diisi: ' + emptyFields.join(', '));
        // focus first empty field
        const firstEmpty = requiredFields.find(f => {
          const el = document.getElementById(f.id);
          return !(el && String((el.value || '')).trim());
        });
        if (firstEmpty) {
          const el = document.getElementById(firstEmpty.id);
          if (el && typeof el.focus === 'function') el.focus();
        }
        return; // stop execution
      }

      // collect form values (after validation)
      const tipeProperti = (document.getElementById('tipe-properti') || {}).value || '';
      const targetAudiens = (document.getElementById('target-audiens') || {}).value || '';
      const dataTeknis = (document.getElementById('data-teknis') || {}).value || '';
      const fiturUnik = (document.getElementById('fitur-unik') || {}).value || '';
      const nadaSuara = (document.getElementById('nadaSuara') || {}).value || '';
      const harga = (document.getElementById('harga') || {}).value || '';

      const payload = { tipeProperti, targetAudiens, dataTeknis, fiturUnik, nadaSuara, harga };

      // UX: disable button
      generateButton.disabled = true;
      generateButton.textContent = 'Meminta AI...';

  // hide langkah 3 while generating (page starts with langkah-3 hidden)
  if (langkah3Container) langkah3Container.style.display = 'none';

      try {
        const resp = await fetch('/.netlify/functions/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
            // MUST parse outer JSON first
            let responseBody;
            if (!resp.ok) {
              // read response text/body for debugging
              const errTxt = await resp.text().catch(() => '');
              console.error('Generate API returned non-OK:', resp.status, errTxt);
              setStatus('Server error: ' + (errTxt || resp.statusText), true);
              // still try to parse for any useful payload
              try { responseBody = JSON.parse(errTxt); } catch { responseBody = errTxt; }
            } else {
              try { responseBody = await resp.json(); } catch (err) {
                // fallback: try text
                const txt = await resp.text();
                try { responseBody = JSON.parse(txt); } catch { responseBody = txt; }
              }
            }

        // Then parse inner JSON: JSON.parse(responseBody.body)
  const data = parseNestedResponse(responseBody);

        // Defensive: ensure object
        if (!data || typeof data !== 'object') {
          setStatus('Response tidak sesuai format JSON yang diharapkan dari generate.js', true);
          // show raw
          setPreSafe(outputPortal, typeof data === 'string' ? data : JSON.stringify(data));
          renderTitles(null);
          // fill placeholders for other cards
          setPreSafe(outputIG, null);
          setPreSafe(outputTiktok, null);
          setPreSafe(outputWA, null);
          setPreSafe(outputAudit, null);
          return;
        }

        // Extract cards defensively
        const kartu_portal = data.kartu_portal ?? null;
        const kartu_ig = data.kartu_ig ?? null;
        const kartu_tiktok = data.kartu_tiktok ?? null;
        const kartu_fb = data.kartu_fb ?? null;
        const kartu_wa = data.kartu_wa ?? null;
        const kartu_audit = data.kartu_audit ?? null;

        // 1. Titles (judul_1..5)
        renderTitles(kartu_portal);

        // 2. Portal content: deskripsi + seo_keywords
        if (kartu_portal && (kartu_portal.deskripsi || kartu_portal.seo_keywords)) {
          // Render portal description and SEO keywords as HTML with safe escaping
          const descHtml = kartu_portal.deskripsi ? '<div class="portal-content">' + escapeHtml(kartu_portal.deskripsi) + '</div>' : '';
          const seoHtml = kartu_portal.seo_keywords ? '<div class="seo-keywords">SEO Keywords: ' + escapeHtml(kartu_portal.seo_keywords) + '</div>' : '';
          if (outputPortal) {
            outputPortal.innerHTML = descHtml + seoHtml;
          }
        } else {
          if (outputPortal) outputPortal.textContent = 'kartu_portal tidak lengkap atau tidak tersedia';
        }

        // 3. IG: caption + hashtags
        if (kartu_ig) {
          const caption = kartu_ig.caption || '';
          const hashtags = kartu_ig.hashtags || kartu_ig.hashtag || '';
          const igText = [caption, hashtags ? ('Hashtags: ' + hashtags) : ''].filter(Boolean).join('\n\n');
          setPreSafe(outputIG, igText || JSON.stringify(kartu_ig, null, 2));
        } else {
          setPreSafe(outputIG, 'kartu_ig tidak tersedia');
        }

        // 4. TikTok: hooks + skrip_psr
        if (kartu_tiktok) {
          const hooks = [];
          if (kartu_tiktok.hook_1) hooks.push('Hook 1: ' + kartu_tiktok.hook_1);
          if (kartu_tiktok.hook_2) hooks.push('Hook 2: ' + kartu_tiktok.hook_2);
          if (kartu_tiktok.hook_3) hooks.push('Hook 3: ' + kartu_tiktok.hook_3);
          if (kartu_tiktok.skrip_psr) hooks.push('Skrip PSR:\n' + kartu_tiktok.skrip_psr);
          setPreSafe(outputTiktok, hooks.length ? hooks.join('\n\n') : JSON.stringify(kartu_tiktok, null, 2));
        } else {
          setPreSafe(outputTiktok, 'kartu_tiktok tidak tersedia');
        }

        // 5. WA
        if (kartu_wa) {
          setPreSafe(outputWA, typeof kartu_wa === 'string' ? kartu_wa : JSON.stringify(kartu_wa, null, 2));
        } else {
          setPreSafe(outputWA, 'kartu_wa tidak tersedia');
        }

        // 6. Audit (string of bullet points)
        if (kartu_audit) {
          // kartu_audit expected to be a single string with lines starting '-'
          setPreSafe(outputAudit, typeof kartu_audit === 'string' ? kartu_audit : JSON.stringify(kartu_audit, null, 2));
        } else {
          setPreSafe(outputAudit, 'kartu_audit tidak tersedia');
        }

        setStatus('Generate selesai', false);
  // show langkah 3 (dashboard) so user can see outputs
  if (langkah3Container) langkah3Container.style.display = 'block';

      } catch (error) {
        console.error('Error generate:', error);
        setStatus('Terjadi error saat meminta generate: ' + (error && error.message ? error.message : String(error)), true);
        // show langkah 3 so user can inspect any partial/raw output
        if (langkah3Container) langkah3Container.style.display = 'block';
      } finally {
        generateButton.disabled = false;
        generateButton.textContent = prevText || 'Generate Konten';
      }
    });
  }
});