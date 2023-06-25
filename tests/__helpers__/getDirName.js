import { fileURLToPath } from 'node:url';
import { dirname, normalize } from 'pathe';

function getDirName( url ) {
	const filePath = normalize( fileURLToPath( url ) );
	const dirPath = dirname( filePath );

	return dirPath;
}

export default getDirName;
