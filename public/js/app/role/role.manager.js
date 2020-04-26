class RoleManager {
  constructor({ onClick }) {
    this.rTable = rTable;
    this.onClick = onClick;
    this.load();
    this.apiPath = "/api/v1";
    this.baseUrl = "/api/v1/roles";
  }

  add() {
    $("#addRole").modal("show");
    this.listAvailablePermissions();
  }

  async loadAllPermissions() {}

  listAvailablePermissions() {
    var me = this;
    const permissionList = $("select[name = total_permission]");
    $.ajax({
      url: `${this.apiPath}/static/permissions`,
      headers: rs.session.getToken()
    }).done(d => {
      d.forEach(e => {
        permissionList.append(`<option value = "${e}">${e}</option>`);
      });
      permissionList.chosen({
        width: "100%"
      });
    });
    permissionList.on("change", e => {
      let permissionSelected = permissionList.val();
      permissionSelected = permissionSelected.toString();
      $(".permission_tagsInput").tagsinput("add", permissionSelected);
    });
  }

  load() {
    let cb;
    this.loadTable();
    $(".permission_tagsInput").tagsinput({
      tagClass: "label label-primary"
    });
    var me = this;
    $("#rTable tbody").one("click", "tr", function() {
      cb = true;
      var id = this.data;
      var data = me.rTable.row(this).data();
      $("#role_name").html(data.name);
      $("#permission_block").show();
      me.onClick(data, cb);
    });
    $("#rTable tbody").on("click", "tr", function() {
      var id = this.data;
      var data = me.rTable.row(this).data();
      $("#role_name").html(data.name);
      $("#permission_block").show();
      me.onClick(data);
    });
  }

  loadTable() {
    var me = this;
    let pageLength = 8;
    this.rTable = $("#rTable").DataTable({
      pageLength,
      processing: true,
      responsive: true,
      filter: true,
      sort: false,
      serverSide: true,
      searchDelay: 500,
      dom: "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-4'i><'col-sm-8'<'float-right p-2'p>>>",
      ajax: {
        url: `/api/v1/roles`,
        headers: rs.session.getToken(),
        dataFilter: data => {
          let json = JSON.parse(data);
          json.recordsTotal = json.total;
          json.recordsFiltered = json.total;
          if (json.total > pageLength) {
            $("#rTable_wrapper .dataTables_info").show();
            $("#rTable_wrapper .dataTables_paginate").show();
          } else {
            $("#rTable_wrapper .dataTables_info").hide();
            $("#rTable_wrapper .dataTables_paginate").hide();
          }
          return JSON.stringify(json); // return JSON string
        },
        data: function(d) {
          return $.extend(
            {},
            {
              start: d.start,
              limit: d.length,
              search: d.search
            }
          );
        }
      },
      columns: [
        {
          data: "name"
        },
        {
          data: null,
          render: d => {
            if (d.expiry_date) {
              return moment(d.expiry_date).format("YYYY-MM-DD");
            } else {
              return "Never";
            }
          }
        },
        {
          data: "is_system"
        },
        {
          data: null,
          class: "text-center",
          render: (d, type, full, meta) => {
            if (d.is_system) return "";
            return `<button class= "btn btn-danger btn-xs" onclick="role.remove('${
              d.name
            }');"><i class="fa fa-trash"></i></button>`;
          }
        }
      ]
    });
  }

  remove(name) {
    swal(
      {
        title: "Are you sure?",
        text: "You are removing a role",
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
            url: `${this.baseUrl}/${name}`,
            headers: rs.session.getToken(),
            method: "DELETE"
          })
            .done(d => {
              this.rTable.ajax.url(this.baseUrl).load();
            })
            .fail(e => {
              alert("error occured");
            });
      }
    );
  }

  resetForm() {
    $("#frmAddRole").trigger("reset");
    $(".permission_tagsInput").tagsinput("removeAll");
    $("select[name = total_permission]")
      .val("")
      .trigger("chosen:updated");
  }

  save() {
    let data = rs.form.get("#frmAddRole");
    let selectedPermissions = $(".permission_tagsInput")
      .val()
      .split(",");
    data.permissions = selectedPermissions;
    $.ajax({
      url: `${this.baseUrl}`,
      headers: rs.session.getToken(),
      method: "POST",
      data
    }).done(d => {
      this.rTable.ajax.url(this.baseUrl).load();
      $("#addRole").modal("hide");
      this.resetForm();
    });
  }
}
