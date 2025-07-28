import '@testing-library/jest-dom';

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    to: jest.fn(),
    from: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn(),
      from: jest.fn(),
      add: jest.fn(),
      addLabel: jest.fn(),
      call: jest.fn(),
      clearProps: jest.fn(),
      delay: jest.fn(),
      duration: jest.fn(),
      eventCallback: jest.fn(),
      fromTo: jest.fn(),
      getTweensOf: jest.fn(),
      invalidate: jest.fn(),
      kill: jest.fn(),
      killTweensOf: jest.fn(),
      pause: jest.fn(),
      play: jest.fn(),
      progress: jest.fn(),
      restart: jest.fn(),
      resume: jest.fn(),
      reverse: jest.fn(),
      seek: jest.fn(),
      set: jest.fn(),
      setTweensOf: jest.fn(),
      staggerFrom: jest.fn(),
      staggerFromTo: jest.fn(),
      staggerTo: jest.fn(),
      time: jest.fn(),
      timeScale: jest.fn(),
      to: jest.fn(),
      tweenFromTo: jest.fn(),
      tweenTo: jest.fn(),
      yoyo: jest.fn(),
    })),
    registerPlugin: jest.fn(),
    set: jest.fn(),
    getProperty: jest.fn(),
    getTweensOf: jest.fn(),
    isTweening: jest.fn(),
    killTweensOf: jest.fn(),
    setTweensOf: jest.fn(),
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
    staggerFrom: jest.fn(),
    staggerFromTo: jest.fn(),
    staggerTo: jest.fn(),
    tweenFromTo: jest.fn(),
    tweenTo: jest.fn(),
    delayedCall: jest.fn(),
    exportRoot: jest.fn(),
    getById: jest.fn(),
    globalTimeline: {
      time: jest.fn(),
      timeScale: jest.fn(),
      progress: jest.fn(),
      totalTime: jest.fn(),
      totalDuration: jest.fn(),
      totalProgress: jest.fn(),
      duration: jest.fn(),
      delay: jest.fn(),
      repeat: jest.fn(),
      repeatDelay: jest.fn(),
      yoyo: jest.fn(),
      yoyoEase: jest.fn(),
      kill: jest.fn(),
      invalidate: jest.fn(),
      pause: jest.fn(),
      play: jest.fn(),
      restart: jest.fn(),
      resume: jest.fn(),
      reverse: jest.fn(),
      seek: jest.fn(),
      set: jest.fn(),
      add: jest.fn(),
      addLabel: jest.fn(),
      call: jest.fn(),
      clearProps: jest.fn(),
      eventCallback: jest.fn(),
      fromTo: jest.fn(),
      getTweensOf: jest.fn(),
      killTweensOf: jest.fn(),
      setTweensOf: jest.fn(),
      staggerFrom: jest.fn(),
      staggerFromTo: jest.fn(),
      staggerTo: jest.fn(),
      time: jest.fn(),
      timeScale: jest.fn(),
      to: jest.fn(),
      tweenFromTo: jest.fn(),
      tweenTo: jest.fn(),
      yoyo: jest.fn(),
    },
  },
  ScrollTrigger: {
    create: jest.fn(),
    getAll: jest.fn(() => []),
    refresh: jest.fn(),
    update: jest.fn(),
    kill: jest.fn(),
    killAll: jest.fn(),
    clearMatchMedia: jest.fn(),
    clearScrollMemory: jest.fn(),
    config: jest.fn(),
    defaults: jest.fn(),
    endAll: jest.fn(),
    getById: jest.fn(),
    isInViewport: jest.fn(),
    maxScroll: jest.fn(),
    observe: jest.fn(),
    refresh: jest.fn(),
    setMatchMedia: jest.fn(),
    sort: jest.fn(),
    update: jest.fn(),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
