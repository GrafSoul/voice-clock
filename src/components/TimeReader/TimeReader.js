import React, { useState, useEffect, useRef } from 'react';

import classes from './TimeReader.module.scss';

const template = {
    five: [
        '00',
        '05',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
        '55',
    ],
    ten: ['00', '10', '20', '30', '40', '50'],
    fifteen: ['00', '15', '30', '45'],
    twenty: ['00', '20', '40'],
    thirty: ['00', '30'],
    hour: ['00'],
};

const TextReader = ({ hours, min }) => {
    const voices = useRef(null);
    const utteranceRef = useRef(null); // Store utterance in ref

    const [settings, setSettings] = useState({
        rate: 1,
        pitch: 1,
        volume: 1,
        period: 'hour',
        voice: 0,
    });

    // Initialize utterance once
    if (!utteranceRef.current) {
        utteranceRef.current = new SpeechSynthesisUtterance();
    }

    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('settings');
            if (!savedSettings) {
                setLocalStorage();
            } else {
                const getSettings = JSON.parse(savedSettings);
                setSettings({
                    rate: getSettings.rate,
                    pitch: getSettings.pitch,
                    volume: getSettings.volume,
                    period: getSettings.period,
                    voice: getSettings.voice,
                });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            setLocalStorage();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        template[settings.period].forEach((item) => {
            if (item === min) {
                handlerSpeak(`${hours}:${min}`);
            }
        });
        // eslint-disable-next-line
    }, [settings, hours, min]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (voices.current) {
                injectVoices(voices.current, speechSynthesis.getVoices());
                voices.current.selectedIndex = settings.voice;
            }
        }, 1000);
        
        return () => clearTimeout(timeoutId); // CLEANUP!
        // eslint-disable-next-line
    }, [voices, settings]);

    const injectVoices = (voicesElement, voices) => {
        // Filter only Russian and English voices
        const filteredVoices = voices.filter((voice) => {
            const lang = voice.lang.toLowerCase();
            return (
                lang.startsWith('ru') || // Russian
                lang.startsWith('en')    // English
            );
        });

        voicesElement.innerHTML = filteredVoices
            .map((voice) => {
                let option = document.createElement('option');
                option.value = voice.lang;
                option.textContent =
                    voice.name + (voice.default ? ' (default)' : '');
                option.setAttribute('data-voice-uri', voice.voiceURI);
                return option;
            })
            .map((option) => {
                return option.outerHTML;
            })
            .join('');
    };

    const handlerSpeak = (time) => {
        let selectedOption =
            voices.current.options[voices.current.selectedIndex];

        let selectedVoice = speechSynthesis
            .getVoices()
            .filter((voice) => {
                return (
                    voice.voiceURI ===
                    selectedOption.getAttribute('data-voice-uri')
                );
            })
            .pop();

        const utterance = utteranceRef.current;
        utterance.text = time;
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;

        speechSynthesis.speak(utterance);
    };

    const setLocalStorage = () => {
        try {
            localStorage.setItem('settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const handlerVoice = () => {
        setSettings((set) => ({ ...set, voice: voices.current.selectedIndex }));
        try {
            localStorage.setItem(
                'settings',
                JSON.stringify({
                    ...settings,
                    voice: voices.current.selectedIndex,
                }),
            );
        } catch (error) {
            console.error('Failed to save voice setting:', error);
        }
        speechSynthesis.cancel();
    };

    const handlerRate = (e) => {
        let currentRate = e.target.value;
        setSettings((set) => ({ ...set, rate: currentRate }));
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerPitch = (e) => {
        let currentPitch = e.target.value;
        setSettings((set) => ({ ...set, pitch: currentPitch }));
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerVolume = (e) => {
        let currentVolume = e.target.value;
        setSettings((set) => ({ ...set, volume: currentVolume }));
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerReset = () => {
        setSettings({
            rate: 1,
            pitch: 1,
            volume: 1,
            period: 'hour',
            voice: 0,
        });
        injectVoices(voices.current, speechSynthesis.getVoices());
        setLocalStorage();
        speechSynthesis.cancel();
    };

    const handlerSelectTime = (e) => {
        let currentSelectTime = e.target.value;
        setSettings((set) => ({ ...set, period: currentSelectTime }));
        try {
            localStorage.setItem(
                'settings',
                JSON.stringify({ ...settings, period: currentSelectTime }),
            );
        } catch (error) {
            console.error('Failed to save period setting:', error);
        }
        speechSynthesis.cancel();
    };

    return (
        <div className={classes.settings}>
            <div className={classes.settingsContent}>
                <div className={classes.settingsLeftColumn}>
                    <div className={classes.settingsMinutes}>
                        <label htmlFor="selectTime">Period of time</label>
                        <select
                            name="selectTime"
                            id="selectTime"
                            onChange={(e) => handlerSelectTime(e)}
                            value={settings.period}
                        >
                            <option default value="hour">
                                Every Hour
                            </option>
                            <option value="five">Every Five Minutes</option>
                            <option value="ten">Every Ten Minutes</option>
                            <option value="fifteen">
                                Every Fifteen Minutes
                            </option>
                            <option value="twenty">Every Twenty Minutes</option>
                            <option value="thirty">Every Thirty Minutes</option>
                        </select>
                    </div>
                    <div className={classes.settingsVoice}>
                        <label htmlFor="voice">Voice:</label>
                        <select
                            id="voice"
                            ref={voices}
                            onChange={handlerVoice}
                        ></select>
                    </div>
                    <button
                        className={classes.testButton}
                        type="button"
                        id="button-speak"
                        onClick={() => handlerSpeak(`${hours}:${min}`)}
                    >
                        <i className="fas fa-play"></i> Test
                    </button>
                    <button
                        className={classes.testButton}
                        type="button"
                        id="button-speak"
                        onClick={handlerReset}
                    >
                        <i className="fas fa-redo-alt"></i> Reset
                    </button>
                </div>

                <div className={classes.settingsRightColumn}>
                    <div className={classes.settingsRange}>
                        <label htmlFor="rate">
                            Rate: <b>{settings.rate}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="rate"
                            min="0.1"
                            max="2"
                            value={settings.rate}
                            step="0.1"
                            onChange={(e) => handlerRate(e)}
                        />

                        <label htmlFor="pitch">
                            Pitch: <b>{settings.pitch}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="pitch"
                            min="0.1"
                            max="2"
                            value={settings.pitch}
                            step="0.1"
                            onChange={(e) => handlerPitch(e)}
                        />

                        <label htmlFor="volume">
                            Volume: <b>{settings.volume}</b>
                        </label>
                        <input
                            className={classes.range}
                            type="range"
                            id="volume"
                            min="0.1"
                            max="2"
                            value={settings.volume}
                            step="0.1"
                            onChange={(e) => handlerVolume(e)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextReader;
