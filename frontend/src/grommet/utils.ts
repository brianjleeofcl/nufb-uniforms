export const enum RespSizes {
  S = 'small',
  M = 'medium',
  L = 'large'
}

export function sizeIsS(size: string) {
  return size === RespSizes.S;
}

export function sizeIsM(size: string) {
  return size === RespSizes.M;
}

export function sizeIsL(size: string) {
  return size === RespSizes.L;
}

