class UserDetails {
  constructor({ user_id }) {
    this.user_id = user_id;
    this.rtable = rTable;
    this.currentUserRoles = [];
    this.proccessing = false;
  }

  addRole(value, cb) {
    let data = {
      roles: value
    };
    $.ajax({
      url: `/api/v1/users/${this.user_id}/roles`,
      headers: rs.session.getToken(),
      method: "POST",
      data
    }).done(d => {
      this.rtable.clear();
      this.rtable.destroy();
      this.loadUserData();
      if (cb) cb();
      $(".select2")
        .empty()
        .trigger("change");
      this.listAvailableRoles();
    });
  }

  createUserRolesTable(roles) {
    this.rtable = $(".rTable").DataTable({
      pageLength: 5,
      sort: false,
      dom: "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-4'i><'col-sm-8'<'float-right p-2'p>>>",
      columns: [
        {
          title: "Roles"
        },
        {
          title: "Action",
          data: null,
          render: data => {
            return `<button class= "btn btn-danger btn-xs" onclick="page.removeRole('${data}');"><i class="fa fa-trash"></i></button>`;
          }
        }
      ]
    });
    this.loadRolesTable(roles);
  }

  listAvailableRoles() {
    var me = this;

    $(".select2").select2({
      width: "100%",
      placeholder: "Available roles for user",
      ajax: {
        url: "/api/v1/roles",
        headers: rs.session.getToken(),
        dataType: "json",
        data: function(params) {
          var query = {
            search: {
              value: params.term
            },
            limit: 100
          };
          return query;
        },
        processResults: data => {
          let userRole = data.data.map(d => {
            return d.name;
          });
          data = _.map(data, d => {
            return {
              id: d._id,
              role: d.name
            };
          });
          userRole = userRole.filter(n => !this.currentUserRoles.includes(n));
          if (userRole.length > 0) {
            userRole = userRole.map(u => {
              return {
                id: "sdas",
                role: u
              };
            });
          }
          data = userRole;
          return {
            results: data
          };
        },
        cache: true
      },
      escapeMarkup: markup => {
        return markup;
      },
      templateResult: data => {
        if (data.loading) {
          return data.text;
        }
        var markup = `<div class="row" style="max-width:98%">
                <div class="col text-left">${data.role}</div>
            </div>`;

        return markup;
      },
      templateSelection: data => {
        if (data.id === "") {
          return "Search a role to add...";
        } else {
          // me.addRole(data.role)
          if (!me.proccessing) {
            me.proccessing = true;
            me.addRole(data.role, () => {
              me.proccessing = false;
            });
            return "Available roles for user";
          }
        }
      }
    });
  }

  load() {
    this.loadUserData();
    this.listAvailableRoles();
  }

  loadRolesTable(roles) {
    roles.forEach(r => {
      this.rtable.row.add([r]);
    });
    this.rtable.draw();
  }

  loadUserData() {
    $.ajax({
      url: `/api/v1/users/${this.user_id}`,
      headers: rs.session.getToken()
    })
      .done(data => {
        data.name = data.name.full;
        rs.form.set("#frmUser", data, "name,email,phone,gender,dob");
        this.currentUserRoles = data.roles;
        this.createUserRolesTable(data.roles);
      })
      .fail(e => console.log(e));
  }

  removeRole(name) {
    let data = {
      role: name
    };
    swal(
      {
        title: "Are you sure?",
        text: "You are removing a role from this user",
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
            url: `/api/v1/users/${this.user_id}/roles`,
            headers: rs.session.getToken(),
            method: "DELETE",
            data
          })
            .done(d => {
              this.rtable.clear();
              this.rtable.destroy();
              this.loadUserData();
            })
            .fail(e => {
              alert("error occured");
            });
      }
    );
  }
}
