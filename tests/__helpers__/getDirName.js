import { fileURLToPath } from 'node:url';
import { dirname } from 'pathe';

function getDirName( url ) {
	const filePath = fileURLToPath( url );
	const dirPath = dirname( filePath );

	return dirPath;
}

export default getDirName;
