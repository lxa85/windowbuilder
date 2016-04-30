/**
 * Код печатной формы договора
 * 
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2016
 * @module doc_calc_order_contract1
 * Created 17.04.2016
 */

function fake(obj) {

	var templates = this._template.content.children,
		doc = new $p.SpreadsheetDocument(),
		print_data;

	// получаем данные печати
	return obj.print_data.then(function (res) {

		print_data = res;

		// выводим заголовок
		doc.put(dhx4.template(templates.header.innerHTML, print_data), templates.header.attributes);

		// получаем объекты продукций
		var aobjs = [];
		obj.production.forEach(function (row) {
			if(!row.characteristic.empty())
				aobjs.push($p.cat.characteristics.get(row.characteristic.ref, true, true));
		});

		return Promise.all(aobjs);

	})
		.then(function () {

			// выводим табличную часть
			var table_div = document.createElement("div"),
				table_footer = document.createElement("div");

			table_div.innerHTML = templates.table.innerHTML;
			var table_table = table_div.querySelector("table"),
				tpl_table_row = table_table.querySelector("tbody").querySelector("tr");

			tpl_table_row.parentElement.removeChild(tpl_table_row);

			obj.production.forEach(function (row) {

				var table_row = document.createElement("TR");
				table_row.innerHTML = dhx4.template(tpl_table_row.innerHTML, obj.row_description(row));
				table_table.appendChild(table_row);

			});


			// выводим подвал табличной части в table_div
			table_footer.innerHTML = dhx4.template(templates.table_footer.innerHTML, print_data);
			table_div.appendChild(table_footer);

			// собственно, вывод табличной части в отчет
			doc.put(table_div.innerHTML, table_div.attributes);


			// выводим подвал отчета
			doc.put(dhx4.template(templates.footer.innerHTML, print_data), templates.footer.attributes);

			// возаращаем сформированный документ
			return doc;
			
		});
	
}