export class View {
  constructor() {
    this.loadTemplate = this.loadTemplate.bind(this);
  }

  async loadTemplate(templatePath) {
    const response = await fetch(new URL(templatePath, import.meta.url));
    return response.text();
  }
}
