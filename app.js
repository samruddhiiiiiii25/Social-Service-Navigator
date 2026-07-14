(() => {
  const LANGUAGES = [
    { code: 'en', native: 'English', english: 'English' },
    { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
    { code: 'mr', native: 'मराठी', english: 'Marathi' },
    { code: 'ko', native: '한국어', english: 'Korean' },
    { code: 'zh', native: '中文', english: 'Chinese' },
    { code: 'de', native: 'Deutsch', english: 'German' },
    { code: 'es', native: 'Español', english: 'Spanish' },
  ];

  // UI copy per language. Falls back to English for any key not present.
  const UI_STRINGS = {
    en: {
      appTitle: 'Find Local Help',
      langHeading: 'Choose your language',
      langSubhead: "Select the language you'd like to talk in.",
      changeLanguage: 'Change language',
      introHeading: 'What do you need help with?',
      introBody: 'Describe it in your own words — there\u2019s no wrong way to ask. For example: "my landlord gave me a letter" or "I don\u2019t have food for this week."',
      safetyNote: "If this is an emergency, we'll show you a phone number to call right away.",
      placeholder: 'Type what you need\u2026',
      errorGeneric: "Something went wrong on our end. If this is urgent, please call: ",
      locationShare: 'Share location',
      locationSharing: 'Finding you\u2026',
      locationOn: 'Location on',
      locationOff: 'No location',
      locationDenied: 'Location off',
      locationHint: 'Sharing your location helps us show the closest options.',
    },
    hi: {
      appTitle: 'स्थानीय सहायता खोजें',
      langHeading: 'अपनी भाषा चुनें',
      langSubhead: 'वह भाषा चुनें जिसमें आप बात करना चाहते हैं।',
      changeLanguage: 'भाषा बदलें',
      introHeading: 'आपको किस चीज़ में मदद चाहिए?',
      introBody: 'अपने शब्दों में बताएं — पूछने का कोई गलत तरीका नहीं है। जैसे: "मकान मालिक ने मुझे एक पत्र दिया" या "इस हफ्ते मेरे पास खाना नहीं है।"',
      safetyNote: 'अगर यह एक आपातकाल है, तो हम आपको तुरंत कॉल करने के लिए एक फ़ोन नंबर दिखाएंगे।',
      placeholder: 'अपनी ज़रूरत लिखें…',
      errorGeneric: 'हमारी ओर से कुछ गलत हो गया। अगर यह जरूरी है, तो कृपया कॉल करें: ',
      locationShare: 'स्थान साझा करें',
      locationSharing: 'खोज रहे हैं…',
      locationOn: 'स्थान चालू',
      locationOff: 'स्थान नहीं',
      locationDenied: 'स्थान बंद',
      locationHint: 'अपना स्थान साझा करने से हमें आपको सबसे नज़दीकी विकल्प दिखाने में मदद मिलती है।',
    },
    mr: {
      appTitle: 'स्थानिक मदत शोधा',
      langHeading: 'तुमची भाषा निवडा',
      langSubhead: 'तुम्हाला ज्या भाषेत बोलायचे आहे ती निवडा.',
      changeLanguage: 'भाषा बदला',
      introHeading: 'तुम्हाला कशासाठी मदत हवी आहे?',
      introBody: 'तुमच्या स्वतःच्या शब्दांत सांगा — विचारण्याची कोणतीही चुकीची पद्धत नाही. उदा: "घरमालकाने मला एक पत्र दिले" किंवा "या आठवड्यात माझ्याकडे अन्न नाही."',
      safetyNote: 'ही आणीबाणी असल्यास, आम्ही तुम्हाला लगेच कॉल करण्यासाठी एक फोन नंबर दाखवू.',
      placeholder: 'तुम्हाला काय हवे आहे ते लिहा…',
      errorGeneric: 'आमच्याकडून काहीतरी चूक झाली. हे तातडीचे असल्यास, कृपया कॉल करा: ',
      locationShare: 'स्थान सामायिक करा',
      locationSharing: 'शोधत आहोत…',
      locationOn: 'स्थान चालू',
      locationOff: 'स्थान नाही',
      locationDenied: 'स्थान बंद',
      locationHint: 'तुमचे स्थान सामायिक केल्याने आम्हाला तुम्हाला सर्वात जवळचे पर्याय दाखवण्यास मदत होते.',
    },
    ko: {
      appTitle: '지역 도움 찾기',
      langHeading: '언어를 선택하세요',
      langSubhead: '대화하고 싶은 언어를 선택하세요.',
      changeLanguage: '언어 변경',
      introHeading: '어떤 도움이 필요하신가요?',
      introBody: '편하게 말씀해 주세요 — 틀린 질문 방식은 없습니다. 예: "집주인이 편지를 줬어요" 또는 "이번 주에 먹을 음식이 없어요."',
      safetyNote: '긴급 상황이라면, 바로 전화할 수 있는 번호를 안내해 드립니다.',
      placeholder: '필요한 내용을 입력하세요…',
      errorGeneric: '문제가 발생했습니다. 긴급한 경우 다음 번호로 전화해 주세요: ',
      locationShare: '위치 공유',
      locationSharing: '위치 찾는 중…',
      locationOn: '위치 켜짐',
      locationOff: '위치 없음',
      locationDenied: '위치 꺼짐',
      locationHint: '위치를 공유하면 가장 가까운 옵션을 보여드릴 수 있습니다.',
    },
    zh: {
      appTitle: '寻找本地帮助',
      langHeading: '选择您的语言',
      langSubhead: '请选择您想使用的语言。',
      changeLanguage: '更改语言',
      introHeading: '您需要什么帮助？',
      introBody: '用您自己的话描述——没有错误的提问方式。例如："房东给了我一封信"或"这周我没有食物了。"',
      safetyNote: '如果这是紧急情况，我们会立即为您提供可拨打的电话号码。',
      placeholder: '输入您需要的帮助…',
      errorGeneric: '我们这边出了点问题。如果情况紧急，请拨打：',
      locationShare: '共享位置',
      locationSharing: '正在定位…',
      locationOn: '位置已开启',
      locationOff: '未共享位置',
      locationDenied: '位置已关闭',
      locationHint: '共享您的位置可以帮助我们为您显示最近的选项。',
    },
    de: {
      appTitle: 'Lokale Hilfe finden',
      langHeading: 'Wählen Sie Ihre Sprache',
      langSubhead: 'Wählen Sie die Sprache, in der Sie sprechen möchten.',
      changeLanguage: 'Sprache ändern',
      introHeading: 'Wobei brauchen Sie Hilfe?',
      introBody: 'Beschreiben Sie es mit Ihren eigenen Worten — es gibt keine falsche Art zu fragen. Zum Beispiel: „Mein Vermieter hat mir einen Brief gegeben" oder „Ich habe diese Woche kein Essen."',
      safetyNote: 'Falls dies ein Notfall ist, zeigen wir Ihnen sofort eine Telefonnummer zum Anrufen.',
      placeholder: 'Schreiben Sie, was Sie brauchen…',
      errorGeneric: 'Bei uns ist etwas schiefgelaufen. Falls es dringend ist, rufen Sie bitte an: ',
      locationShare: 'Standort teilen',
      locationSharing: 'Standort wird ermittelt…',
      locationOn: 'Standort an',
      locationOff: 'Kein Standort',
      locationDenied: 'Standort aus',
      locationHint: 'Wenn Sie Ihren Standort teilen, können wir Ihnen die nächstgelegenen Optionen zeigen.',
    },
    es: {
      appTitle: 'Buscar ayuda local',
      langHeading: 'Elige tu idioma',
      langSubhead: 'Selecciona el idioma en el que quieres hablar.',
      changeLanguage: 'Cambiar idioma',
      introHeading: '¿Con qué necesitas ayuda?',
      introBody: 'Descríbelo con tus propias palabras — no hay una forma incorrecta de preguntar. Por ejemplo: "mi casero me dio una carta" o "no tengo comida para esta semana."',
      safetyNote: 'Si esto es una emergencia, te mostraremos un número de teléfono para llamar de inmediato.',
      placeholder: 'Escribe lo que necesitas…',
      errorGeneric: 'Algo salió mal de nuestro lado. Si es urgente, llama al: ',
      locationShare: 'Compartir ubicación',
      locationSharing: 'Buscando tu ubicación…',
      locationOn: 'Ubicación activada',
      locationOff: 'Sin ubicación',
      locationDenied: 'Ubicación desactivada',
      locationHint: 'Compartir tu ubicación nos ayuda a mostrarte las opciones más cercanas.',
    },
  };

  const FALLBACK_NUMBER_DISPLAY = '000-000-9999';

  const els = {
    langGrid: document.getElementById('lang-grid'),
    screenLanguage: document.getElementById('screen-language'),
    screenChat: document.getElementById('screen-chat'),
    btnChangeLanguage: document.getElementById('btn-change-language'),
    btnLocation: document.getElementById('btn-location'),
    locationLabel: document.getElementById('location-label'),
    locationHint: document.getElementById('location-hint'),
    currentLangPill: document.getElementById('current-lang-pill'),
    messages: document.getElementById('messages'),
    chatScroll: document.getElementById('chat-scroll'),
    typingIndicator: document.getElementById('typing-indicator'),
    composer: document.getElementById('composer'),
    composerInput: document.getElementById('composer-input'),
    composerSend: document.getElementById('composer-send'),
    appTitle: document.getElementById('app-title'),
    langHeading: document.getElementById('lang-heading'),
    langSubheadText: document.getElementById('lang-subhead-text'),
    changeLangLabel: document.getElementById('change-lang-label'),
    introHeading: document.getElementById('intro-heading'),
    introBody: document.getElementById('intro-body'),
    safetyNoteText: document.getElementById('safety-note-text'),
  };

  let currentLanguage = null;
  // location: null (never asked / denied), or { lat, lng }
  let currentLocation = null;
  let locationState = 'unknown'; // 'unknown' | 'locating' | 'on' | 'denied'

  function t(key) {
    const lang = currentLanguage || 'en';
    return (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || UI_STRINGS.en[key];
  }

  function renderLanguageGrid() {
    els.langGrid.innerHTML = '';
    LANGUAGES.forEach((lang) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'lang-tile';
      tile.setAttribute('role', 'listitem');
      tile.innerHTML = `<span class="native">${lang.native}</span><span class="english">${lang.english}</span>`;
      tile.addEventListener('click', () => selectLanguage(lang.code));
      els.langGrid.appendChild(tile);
    });
  }

  function applyUIStrings() {
    els.appTitle.textContent = t('appTitle');
    els.langHeading.textContent = t('langHeading');
    els.langSubheadText.textContent = t('langSubhead');
    els.changeLangLabel.textContent = t('changeLanguage');
    els.introHeading.textContent = t('introHeading');
    els.introBody.textContent = t('introBody');
    els.safetyNoteText.textContent = t('safetyNote');
    els.composerInput.placeholder = t('placeholder');
    els.locationHint.textContent = t('locationHint');
    const langObj = LANGUAGES.find((l) => l.code === currentLanguage);
    els.currentLangPill.textContent = langObj ? langObj.native : '';
    document.documentElement.lang = currentLanguage || 'en';
    renderLocationButton();
  }

  function renderLocationButton() {
    els.btnLocation.dataset.state = locationState;
    const labels = {
      unknown: t('locationShare'),
      locating: t('locationSharing'),
      on: t('locationOn'),
      denied: t('locationDenied'),
    };
    els.locationLabel.textContent = labels[locationState] || t('locationOff');
    els.locationHint.classList.toggle('hidden', locationState === 'on');
  }

  function requestLocation() {
    if (locationState === 'on' || locationState === 'locating') return;
    if (!('geolocation' in navigator)) {
      locationState = 'denied';
      renderLocationButton();
      return;
    }
    locationState = 'locating';
    renderLocationButton();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        locationState = 'on';
        renderLocationButton();
      },
      () => {
        currentLocation = null;
        locationState = 'denied';
        renderLocationButton();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function selectLanguage(code) {
    currentLanguage = code;
    applyUIStrings();
    els.screenLanguage.classList.add('hidden');
    els.screenChat.classList.remove('hidden');
    els.composerInput.focus();
  }

  function goToLanguagePicker() {
    els.screenChat.classList.add('hidden');
    els.screenLanguage.classList.remove('hidden');
  }

  function addMessage(text, role) {
    const bubble = document.createElement('div');
    bubble.className = `msg msg-${role}`;
    bubble.textContent = text;
    els.messages.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function scrollToBottom() {
    els.chatScroll.scrollTop = els.chatScroll.scrollHeight;
  }

  function setTyping(isTyping) {
    els.typingIndicator.classList.toggle('hidden', !isTyping);
    if (isTyping) scrollToBottom();
  }

  function autoGrowTextarea() {
    els.composerInput.style.height = 'auto';
    els.composerInput.style.height = `${Math.min(els.composerInput.scrollHeight, 120)}px`;
  }

  async function sendMessage(text) {
    addMessage(text, 'user');
    els.composerInput.value = '';
    autoGrowTextarea();
    els.composerSend.disabled = true;
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: currentLanguage,
          location: locationState === 'on' ? currentLocation : null,
        }),
      });

      const data = await res.json();
      setTyping(false);

      if (!res.ok) {
        const fallback = data.fallback_number || FALLBACK_NUMBER_DISPLAY;
        addMessage(`${t('errorGeneric')}${fallback}`, 'error');
        return;
      }

      addMessage(data.reply || '', 'assistant');
    } catch (err) {
      setTyping(false);
      addMessage(`${t('errorGeneric')}${FALLBACK_NUMBER_DISPLAY}`, 'error');
    } finally {
      els.composerSend.disabled = false;
      els.composerInput.focus();
    }
  }

  els.composer.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.composerInput.value.trim();
    if (!text) return;
    sendMessage(text);
  });

  els.composerInput.addEventListener('input', autoGrowTextarea);

  els.composerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      els.composer.requestSubmit();
    }
  });

  els.btnChangeLanguage.addEventListener('click', goToLanguagePicker);
  els.btnLocation.addEventListener('click', requestLocation);

  renderLanguageGrid();
  applyUIStrings();
})();
