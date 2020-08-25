import fs from 'fs';
import path from 'path';
import type { DownloadLinkMessageCreator } from '../../types/message-creator';
import { MJMLMessageCreator } from '../mjml-message-creator';

const TEMPLATE_PATH = path.resolve(__dirname, 'download-link-template.mjml');

export const MJMLDownloadLinkMessageCreator: DownloadLinkMessageCreator = MJMLMessageCreator.create(
  {
    defaultParameters: { baseUrl: 'http://localhost:3030/api/v1/download/' },
    mjmlBodyTemplate: fs.readFileSync(TEMPLATE_PATH, 'utf-8'),
    subjectTemplate: 'Code successfully redeemed!',
  },
);
