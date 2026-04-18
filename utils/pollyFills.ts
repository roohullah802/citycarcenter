// polyfill.ts
if (typeof global.window === "undefined") {
  (global as any).window = global;
}

// Block location.href errors by trapping the 'set' operation
if (typeof window.location === "undefined" || !window.location) {
  const fakeLocation = {
    href: "",
    origin: "",
    protocol: "https:",
    assign: () => {},
    replace: () => {},
    reload: () => {},
  };

  Object.defineProperty(window, "location", {
    get: () => fakeLocation,
    set: (val) => {
      console.log("Blocked Clerk redirect attempt to:", val);
      return true; // Ignore the set command
    },
    configurable: true,
  });
}

if (typeof window.dispatchEvent !== "function") {
  (window as any).dispatchEvent = () => true;
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
