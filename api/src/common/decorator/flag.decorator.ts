export function AddHiddenFlag(verify: Function) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;
      descriptor.value = function(...args: any[]) {
        const config = originalMethod.apply(
          this,
          args,
        ) 
        if(config.flag === undefined) {
            return {...config, flag: verify()}
        } else {
            const {flag, ...restConfig} = config;
            return {...restConfig, flag: flag && verify()}
        }
      };
    };
  }
  