export class FragmentAssociation {
  private readonly rootKey: string;

  constructor(rootKey: string) {
    this.rootKey = rootKey;
  }

  getRootKey(): string {
    return this.rootKey;
  }
}
