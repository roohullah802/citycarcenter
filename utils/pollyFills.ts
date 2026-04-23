// polyfill.ts — minimal, safe version
// DO NOT override window.location — it breaks Clerk initialization in production builds

if (typeof global.dispatchEvent !== "function") {
  (global as any).dispatchEvent = () => true;
}

if (typeof global.CustomEvent !== "function") {
  (global as any).CustomEvent = class {
    type: string;
    detail: any;
    constructor(event: string, params: any = { detail: null }) {
      this.type = event;
      this.detail = params.detail;
    }
  };
}
