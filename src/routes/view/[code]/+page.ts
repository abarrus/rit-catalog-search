import { catalog, type CatalogItem } from "$lib/js/consts";

export function load({ params }) {
    let info: CatalogItem | undefined = catalog.find(item => item.code == params.code);

	return {
		code: params.code,
        info: info
	};
}