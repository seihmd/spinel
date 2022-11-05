export class UndefinedSettingError extends Error {
  constructor(settingKey: string) {
    super(
      `Insufficient setting error: environment variable "${settingKey}" is not found defined.`
    );
  }
}
