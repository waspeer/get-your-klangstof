import path from 'path';
import Handlebars from 'handlebars';
import mjml from 'mjml';
import type { MessageCreator } from '../types/message-creator';
import { createFactoryFromFile } from './helpers/create-factory-from-file';

interface LayoutParameters {
  bodyTemplate: string;
}

interface Props {
  createMJMLTemplate?: (parameters: LayoutParameters) => string;
  defaultParameters?: Record<string, any>;
  mjmlBodyTemplate: string;
  subjectTemplate: string;
}

const LAYOUT_TEMPLATE_PATH = path.resolve(__dirname, 'layout.mjml');
const DEFAULT_MJML_TEMPLATE_FACTORY = createFactoryFromFile(LAYOUT_TEMPLATE_PATH);

export class MJMLMessageCreator<T extends Record<string, any>> implements MessageCreator<T> {
  private createHTML: (parameters: T) => string;
  private createSubject: (parameters: T) => string;
  private defaultParameters: Record<string, any>;

  public constructor({
    createMJMLTemplate = DEFAULT_MJML_TEMPLATE_FACTORY,
    defaultParameters = {},
    mjmlBodyTemplate,
    subjectTemplate,
  }: Props) {
    // The body template needs to be insterted into the layout template
    const MJMLTemplate = createMJMLTemplate({ bodyTemplate: mjmlBodyTemplate });
    const createMJML = Handlebars.compile<T>(MJMLTemplate);

    this.createHTML = (parameters: T) =>
      mjml(createMJML({ ...this.defaultParameters, ...parameters })).html;
    this.createSubject = Handlebars.compile<T>(subjectTemplate);
    this.defaultParameters = defaultParameters;
  }

  public create(parameters: T) {
    const combinedParameters = {
      ...this.defaultParameters,
      ...parameters,
    };

    return {
      subject: this.createSubject(combinedParameters),
      html: this.createHTML(combinedParameters),
    };
  }

  static create(
    options: Pick<Props, 'defaultParameters' | 'mjmlBodyTemplate' | 'subjectTemplate'>,
  ) {
    return new MJMLMessageCreator(options);
  }
}
