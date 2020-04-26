class PermissionManager {
  constructor() {
    this.pTable;
    this.name = null;
    this.permissions = null;
    this.renderTable();
    this.visibilityAddButton();
    this.apiPath = "/api/v1";
    this.baseUrl = "/api/v1/roles";
  }

  add() {
    let data = {
      name: this.name,
      permissions: $("select[name = available_permission]").val()
    };
    $.ajax({
      url: `${this.baseUrl}/permission`,
      headers: rs.session.getToken(),
      method: "POST",
      data
    }).done(d => {
      this.load(this.name);
      $("select[name = available_permission] > option")
        .attr("selected", false)
        .trigger("chosen:updated");
      $("select[name = available_permission] option:selected")
        .prop("selected", false)
        .trigger("chosen:updated");
      this.list(this.permissions);
    });
  }

  toggleAddButton(permission) {
    const btnAdd = $("#btnAddPermissions");
    if (!permission) {
      permission = [];
    }
    if (permission.length == 0) {
      btnAdd.addClass("btn-default");
      btnAdd.removeClass("btn-primary");
      btnAdd.attr("disabled", "disabled");
    } else {
      btnAdd.removeClass("btn-default");
      btnAdd.addClass("btn-primary");
      btnAdd.removeAttr("disabled");
    }
  }

  list(rolePermissions, cb) {
    this.permissions = rolePermissions;
    const permissionList = $("select[name = available_permission]");
    let permissionSelected = permissionList.val();
    this.toggleAddButton(permissionSelected);
    $("select[name = available_permission] option:selected")
      .prop("selected", false)
      .trigger("chosen:updated");
    this.toggleAddButton();

    $.ajax({
      url: `${this.apiPath}/static/permissions`,
      headers: rs.session.getToken()
    }).done(d => {
      let permissions = d.filter(n => !rolePermissions.includes(n));
      if (!cb) {
        permissionList.chosen("destroy");
        permissionList.empty();
      }
      permissions.forEach(e => {
        permissionList.append(`<option value = "${e}">${e}</option>`);
      });
      permissionList.chosen({
        width: "88%"
      });
    });
  }

  load(roleName) {
    this.name = roleName;
    this.pTable.ajax.url(`${this.baseUrl}/${roleName}/permissions`).load();
  }

  renderTable() {
    var me = this;
    this.pTable = $("#pTable").DataTable({
      pageLength: 7,
      responsive: true,
      filter: true,
      sort: false,
      searchDelay: 500,
      deferLoading: false,
      ajax: {
        url: "?",
        headers: rs.session.getToken(),
        dataFilter: data => {
          let json = JSON.parse(data);
          json.recordsTotal = json.total;
          json.recordsFiltered = json.total;
          if (json.total > 7) {
            $("#pTable_wrapper .dataTables_info").show();
            $("#pTable_wrapper .dataTables_paginate").show();
          } else {
            $("#pTable_wrapper .dataTables_info").hide();
            $("#pTable_wrapper .dataTables_paginate").hide();
          }
          return JSON.stringify(json);
        }
      },
      dom: "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-4'i><'col-sm-8'<'float-right p-2'p>>>",
      columns: [
        {
          data: "permissions"
        },
        {
          data: null,
          class: "text-center",
          render: (d, type, full, meta) => {
            return `<button class= "btn btn-danger btn-xs" onclick="permissions.remove('${
              d.permissions
            }');"><i class="fa fa-trash"></i></button>`;
          }
        }
      ]
    });
  }

  remove(permission) {
    let data = { permission };
    swal(
      {
        title: "Are you sure?",
        text: "You are removing a permission",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
      },
      isConfirm => {
        if (isConfirm)
          $.ajax({
            url: `${this.baseUrl}/${this.name}/permission`,
            headers: rs.session.getToken(),
            method: "POST",
            data
          })
            .done(d => {
              this.load(this.name);
              this.list(this.permissions);
            })
            .fail(e => {
              alert("error occured");
            });
      }
    );
  }

  visibilityAddButton() {
    $("select[name = available_permission]").on("change", e => {
      let permissionSelected = $("select[name = available_permission]").val();
      this.toggleAddButton(permissionSelected);
    });
  }
}
