import * as lib from '.';
export async function getCommonNames(philters, fetch = window.fetch) {
	return await lib.getjson('api/distinct/common_name', lib.qstringify(philters), fetch);
}
// get commonname variety
export async function getCommonNameVariety(common_name, filters) {
	filters.common_name = common_name;
	let sizes = await lib.getjson('api/distinct/Telcos:storage_size', filters);
	let colours = await lib.getjson('api/distinct/colour', filters);
	let sample = (await lib.getjson('api/find', { ...filters, limit: 1 }))[0];
	let img = sample.merchant_image_url;
	let desc = sample.description;
	// replace FFFFFF to transparent in pmg url
	// exclude apple
	if (!common_name.includes('Apple')) img = img.replace('FFFFFF', 'transparent');
	// console.log(img);
	return { sizes, colours, img, desc };
}
export async function getDistinctBrands(philters) {
	let data = await lib.getjson('api/distinct/brand_name?' + lib.qstringify(philters));
	data = data.filter((brand) => brand != 'SIM Card'); // SIM Card - remove
	return data;
}
export async function getDistinctTelcos(philters) {
	return await lib.getjson('api/distinct/Telcos:network?' + lib.qstringify(philters));
}
export async function getDistinctColours() {
	// remove null
	return (await lib.getjson('api/distinct/colour?' + lib.qstringify(selections))).filter((c) => c != null);
}
// Telcos:storage_size
export async function getDistinctSizes() {
	return await lib.getjson('api/distinct/Telcos:storage_size?' + lib.qstringify(selections));
}
export async function getDistinctSimProviders() {
	let providers = await lib.getjson('api/distinct/Telcos:network?Telcos:device_product_json.product_type=SIM%20Card' + lib.qstringify(selections));
	let imgs = await Promise.all(
		providers.map(async (element) => {
			let resp = await lib.getjson(`api/find?Telcos:device_product_json.product_type=SIM%20Card&Telcos:network=${element}&limit=1`);
			return { img: resp[0].merchant_thumb_url, filters: { 'Telcos:network': element, 'Telcos:device_product_json.product_type': 'SIM Card' } };
		})
	);
	return imgs;
}
export async function getDistinctBroadbandModels(ptype = 'Mobile Wi-Fi') {
	let items = await lib.getjson('api/distinct/common_name?Telcos:device_product_json.product_type=Mobile Wi-Fi' + lib.qstringify(selections));
	let imgs = await Promise.all(
		items.map(async (element) => {
			let resp = await lib.getjson(`api/find?Telcos:device_product_json.product_type=Mobile Wi-Fi&common_name=${element}&limit=1`);
			return resp[0].merchant_thumb_url;
		})
	);
	return imgs;
}

// getDeals
export async function getDeals(filters) {
	return await lib.getjson('api/find?' + lib.qstringify(filters));
}

export let colormap = {
	Black: '#000000',
	Blue: '#0d6efd',
	Gold: '#ffc107',
	Green: '#198754',
	Grey: '#6c757d',
	Orange: '#ff7b00',
	Pink: '#cf00cf',
	Purple: '#6f42c1',
	Red: '#dc3545',
	'Rose Gold': '#f3e5f5',
	Silver: '#ced4da',
	White: '#ffffff',
	Yellow: '#ffc107'
};

export let attrTranslate = {
	'Telcos:network': 'Network',
	'Telcos:storage_size': 'Storage',
	colour: 'Colour',
	common_name: 'Model',
	brand_name: 'Brand'
};
