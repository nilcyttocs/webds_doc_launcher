import { LabIcon } from '@jupyterlab/ui-components';

import webdsSvg from '../style/icons/finger-touch-screen-svgrepo-com.svg';
import documentationSvg from '../style/icons/document-svgrepo-com.svg';

export const webdsIcon = new LabIcon({
  name: 'webds_doc_launcher:webds_icon',
  svgstr: webdsSvg
});

export const documentationIcon = new LabIcon({
  name: 'webds_doc_launcher:documentation_icon',
  svgstr: documentationSvg
});
