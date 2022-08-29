import boardMiddleware from './board';
import cloudMiddleware from './cloud';

const rootMiddleware = [...boardMiddleware, ...cloudMiddleware];

export default rootMiddleware;
