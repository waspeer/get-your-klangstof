import { useParams } from '@reach/router';
import React from 'react';
import { useCode } from '../../interaction/codes/code-client';
import { DownloadFeedback } from './sections';

export const DownloadPage = () => {
  const { createDownloadLink, validateDownload } = useCode();
  const { token } = useParams();

  return (
    <main>
      <DownloadFeedback
        token={token}
        actions={{
          createDownloadLink,
          validateDownload,
        }}
      />
    </main>
  );
};
