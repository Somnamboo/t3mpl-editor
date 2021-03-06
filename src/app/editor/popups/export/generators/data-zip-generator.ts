import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { Observable } from 'rxjs';
import { DATA_ZIP_FILE_EXT } from 't3mpl-core/core/constants';
import { DataSerializer } from 't3mpl-core/core/data/data-serializer';
import { exportData } from 't3mpl-core/core/exporter';
import { generateFileName } from 't3mpl-core/core/utils/file-name-generator';

import { StateService } from '../../../state.service';
import { compress, zipExportHandler, ZipFile } from './zip-utils';

@Injectable()
export class DataZipGenerator {

	public constructor(
		private readonly stateService: StateService) {
	}

	public generate(): Observable<ZipFile> {
		return new Observable(r => {
			const zip = new JSZip();

			const dataSerializer = new DataSerializer();

			exportData(
				this.stateService.templateManifest,
				this.stateService.data,
				this.stateService.contentStorage,
				dataSerializer,
				zipExportHandler(zip));

			compress(zip).then((content) => {
				const fileName = generateFileName({
					name: this.stateService.templateManifest.meta.name,
					minUniqueIdLength: 4,
					fileExt: DATA_ZIP_FILE_EXT
				});

				r.next({ content, fileName });
			});
		});
	}
}
