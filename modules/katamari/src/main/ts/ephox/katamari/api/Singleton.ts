import { Cell } from './Cell';
import { Optional } from './Optional';

interface Singleton<T> {
  readonly clear: () => void;
  readonly isSet: () => boolean;
  readonly get: () => Optional<T>;
  readonly set: (value: T) => void;
}

export interface Revocable<T> extends Singleton<T> { }

export interface Api<T> extends Singleton<T> {
  readonly run: (fn: (data: T) => void) => void;
}

export interface Value<T> extends Singleton<T> {
  readonly on: (fn: (data: T) => void) => void;
}

const revocable = <T> (doRevoke: (data: T) => void): Singleton<T> => {
  const subject = Cell(Optional.none<T>());

  const revoke = (): void => subject.get().each(doRevoke);

  const clear = () => {
    revoke();
    subject.set(Optional.none());
  };

  const isSet = () => subject.get().isSome();

  const get = (): Optional<T> => subject.get();

  const set = (s: T) => {
    revoke();
    subject.set(Optional.some(s));
  };

  return {
    clear,
    isSet,
    get,
    set
  };
};

export const destroyable = <T extends { destroy: () => void }> (): Revocable<T> => revocable<T>((s) => s.destroy());

export const unbindable = <T extends { unbind: () => void }> (): Revocable<T> => revocable<T>((s) => s.unbind());

export const api = <T extends { destroy: () => void }> (): Api<T> => {
  const subject = Cell(Optional.none<T>());

  const revoke = () => subject.get().each((s) => s.destroy());

  const clear = () => {
    revoke();
    subject.set(Optional.none());
  };

  const get = (): Optional<T> => subject.get();

  const set = (s: T) => {
    revoke();
    subject.set(Optional.some(s));
  };

  const run = (f: (data: T) => void) => subject.get().each(f);

  const isSet = () => subject.get().isSome();

  return {
    clear,
    isSet,
    set,
    get,
    run
  };
};

export const value = <T> (): Value<T> => {
  const subject = Cell(Optional.none<T>());

  const clear = () => subject.set(Optional.none());

  const get = (): Optional<T> => subject.get();

  const set = (s: T) => subject.set(Optional.some(s));

  const isSet = () => subject.get().isSome();

  const on = (f: (data: T) => void) => subject.get().each(f);

  return {
    clear,
    get,
    set,
    isSet,
    on
  };
};
