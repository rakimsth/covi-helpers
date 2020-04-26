const rs = {};

rs.error = {};

rs.form = {
  get: form => {
    let $form = $(form);
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i) {
      indexed_array[n["name"]] = n["value"];
    });

    return indexed_array;
  },

  set: (form, data, fields) => {
    if (!fields) {
      console.error("Must send field list of fill");
      return;
    }
    fields = fields.split(",");
    _.each(fields, f => {
      $(`${form} input[name=${f}]`).val(data[f]);
      $(`${form} select[name=${f}]`).val(data[f]);
      $(`${form} textarea[name=${f}]`).val(data[f]);
    });
  }
};

rs.session = {
  getToken: () => {
    return { access_token: $.cookie("access_token") };
  },
  getUser: () => {
    let userStr = $.cookie("user");
    if (userStr) return JSON.parse(userStr);
    else return {};
  }
};

rs.utils = {};
rs.plugins = {};
rs.plugins.dataTables = {
  setConfig: config => {
    let newConfig = Object.assign({}, config);
    const defaultAjaxConfig = {
      dataFilter: data => {
        let json = JSON.parse(data);
        json.recordsTotal = json.total;
        json.recordsFiltered = json.total;
        return JSON.stringify(json); // return JSON string
      },
      data: function(d) {
        return $.extend({}, { start: d.start, limit: d.length, search: d.search });
      }
    };

    if (newConfig.ajax) newConfig.ajax = Object.assign(defaultAjaxConfig, newConfig.ajax);

    const defaultCfg = {
      pageLength: 25,
      processing: true,
      responsive: true,
      filter: true,
      sort: false,
      serverSide: true,
      searchDelay: 500,
      dom:
        "<'row'<'col-sm-8'<'float-left'f>><'col-sm-4'<'float-right p-2'l>>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-4'i><'col-sm-8'<'float-right p-2'p>>>"
    };

    return Object.assign(defaultCfg, newConfig);
  }
};
