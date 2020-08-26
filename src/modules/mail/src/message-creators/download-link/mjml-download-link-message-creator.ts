import fs from 'fs';
import path from 'path';
import type { DownloadLinkMessageCreator } from '../../types/message-creator';
import { MJMLMessageCreator } from '../mjml-message-creator';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

const CLIENT_URL = getEnvironmentVariable('CLIENT_URL');
const TEMPLATE_PATH = path.resolve(__dirname, 'download-link-template.mjml');

export const MJMLDownloadLinkMessageCreator: DownloadLinkMessageCreator = MJMLMessageCreator.create(
  {
    defaultParameters: { baseUrl: new URL('download/', CLIENT_URL) },
    mjmlBodyTemplate: fs.readFileSync(TEMPLATE_PATH, 'utf-8'),
    subjectTemplate: 'Code successfully redeemed!',
  },
);
