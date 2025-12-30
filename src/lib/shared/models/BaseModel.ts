import { Tables, Database } from "@/types";

export class BaseModel<T extends Tables<keyof Database["public"]["Tables"]>> {
  constructor(protected data: T) {
    return new Proxy(this, {
      get(target, prop, receiver) {
        // 1. If property is on the Class, return it
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }

        // 2. SAFETY CHECK: If data is missing/null, return undefined
        if (!target.data || typeof target.data !== "object") {
          return undefined;
        }

        // 3. Fallback to raw data
        return Reflect.get(target.data, prop);
      },

      ownKeys(target) {
        // SAFETY CHECK: If data is missing, returns keys of the class only
        if (!target.data || typeof target.data !== "object") {
          return Reflect.ownKeys(target);
        }
        return Reflect.ownKeys(target.data);
      },

      getOwnPropertyDescriptor(target, prop) {
        // SAFETY CHECK: If data is missing, we can't describe properties on it
        if (!target.data || typeof target.data !== "object") {
          return undefined;
        }
        return Reflect.getOwnPropertyDescriptor(target.data, prop);
      },
    });
  }
}
