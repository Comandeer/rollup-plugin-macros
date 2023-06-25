import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function getDirName( url ) {
	const filePath = fileURLToPath( url );
	const dirPath = dirname( filePath );

	return dirPath;
}

export default getDirName;
