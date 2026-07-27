/* Kestrel Survey — the only script on the site.
   Two jobs: the phone navigation disclosure, and the contact form.
   Both are progressive: with this file absent the nav renders open and the
   contact page shows the email address in place of the form. */

(function () {
  'use strict';

  /* ---------------------------------------------------------- navigation */

  var bar = document.querySelector('.bar');
  var toggle = bar && bar.querySelector('.bar__toggle');
  var nav = bar && bar.querySelector('.bar__nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = bar.classList.toggle('bar--open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    /* Escape closes it and returns focus to the control that opened it. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bar.classList.contains('bar--open')) {
        bar.classList.remove('bar--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    /* Following a link inside the panel closes it, so the next page does not
       inherit an open disclosure. */
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        bar.classList.remove('bar--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -------------------------------------------------------- contact form */

  var form = document.querySelector('#enquiry');
  if (!form) return;

  var summary = form.querySelector('#enquiry-summary');
  var summaryList = summary && summary.querySelector('ul');
  var submit = form.querySelector('#enquiry-submit');
  var submitLabel = submit ? submit.textContent : '';

  var RULES = [
    {
      id: 'building',
      message: 'Tell us the building type. It is the first thing the surveyor will ask.'
    },
    {
      id: 'deadline',
      message: 'Tell us the deadline, even approximately. It decides whether we can take it.'
    },
    {
      id: 'reply',
      message: 'Leave a telephone number or an email address so we can come back to you.'
    }
  ];

  function fieldOf(input) {
    return input.closest('.field');
  }

  function clear(input) {
    var field = fieldOf(input);
    if (field) field.classList.remove('field--invalid');
    input.removeAttribute('aria-invalid');
  }

  function mark(input, message) {
    var field = fieldOf(input);
    if (field) field.classList.add('field--invalid');
    input.setAttribute('aria-invalid', 'true');
    var slot = document.getElementById(input.id + '-error');
    if (slot) slot.textContent = message;
  }

  function validate() {
    var failures = [];
    RULES.forEach(function (rule) {
      var input = document.getElementById(rule.id);
      if (!input) return;
      if (input.value.trim() === '') {
        mark(input, rule.message);
        failures.push({ id: rule.id, message: rule.message });
      } else {
        clear(input);
      }
    });
    return failures;
  }

  /* Re-validating a field as soon as it is corrected, but never before it has
     been left, so nothing shouts at someone still typing. */
  RULES.forEach(function (rule) {
    var input = document.getElementById(rule.id);
    if (!input) return;
    input.addEventListener('blur', function () {
      if (input.value.trim() !== '') clear(input);
    });
  });

  var WORDS = ['', 'One thing is', 'Two things are', 'Three things are'];

  function showSummary(failures) {
    if (!summary || !summaryList) return;
    var heading = summary.querySelector('h3');
    if (heading) {
      heading.textContent = (WORDS[failures.length] || failures.length + ' things are') +
        ' missing';
    }
    summaryList.innerHTML = '';
    failures.forEach(function (failure) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + failure.id;
      a.textContent = failure.message;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(failure.id);
        if (target) target.focus();
      });
      li.appendChild(a);
      summaryList.appendChild(li);
    });
    summary.hidden = false;
    summary.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var failures = validate();
    if (failures.length) {
      showSummary(failures);
      return;
    }
    if (summary) summary.hidden = true;

    var value = function (id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    var body = [
      'Building type and address:',
      value('building'),
      '',
      'Deadline:',
      value('deadline'),
      '',
      'How to reach me:',
      value('reply'),
      '',
      'What has happened:',
      value('detail') || '(not given)',
      ''
    ].join('\n');

    /* The busy state is short but real: the mail client can take a moment, and a
       button that still looks clickable invites a second click and a second draft. */
    if (submit) {
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = 'Opening your email…';
    }

    var to = form.getAttribute('data-to') || '';
    window.location.href =
      'mailto:' + to +
      '?subject=' + encodeURIComponent('Enquiry: ' + value('building')) +
      '&body=' + encodeURIComponent(body);

    window.setTimeout(function () {
      if (submit) {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.textContent = submitLabel;
      }
      var done = document.getElementById('enquiry-done');
      if (done) done.hidden = false;
    }, 1200);
  });
})();
