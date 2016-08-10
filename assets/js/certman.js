var CertmanC = Class.extend({
}), Certman = new CertmanC();

$("#delCA").click(function(e) {
	if(!confirm(_("Deleting the certificate authority will invalidate all certificates generated by this one (They will be deleted). Is that OK?"))) {
		e.stopPropagation();
		e.preventDefault();
	}
});

$("table").on("post-body.bs.table", function () {
	$(".default-check").click(function() {
		var $this = this;
		if(confirm(_("Are you sure you want to make this certificate the system default?"))) {
			$.post("ajax.php?module=certman&command=makeDefault", {id: $(this).data("id")}, function( data ) {
				if(data.status) {
					$(".default-check").removeClass("check");
					$($this).addClass("check");
				} else {
					alert(data.message);
				}
			});
		}
	});
});

$("#csrref").change(function() {
	if($(this).val() === "") {
		$("#privatekey-container").removeClass("hidden");
	} else {
		$("#privatekey-container").addClass("hidden");
	}
});

$("#delcsr").click(function() {

});

$(function() {
	$("#capage .selection button.visual").click(function() {
		var type = $(this).data("type");
		$("#capage .general").fadeIn("slow");
		$("#capage ." + type).fadeIn("slow");
		$("#capage .selection").fadeOut("slow");
		return false;
	});

	$("#enableul").click(function() {
		if($(this).prop("checked")){
			$("#pkdiv").removeClass("hidden");
			$("#cdiv").removeClass("hidden");
			$("#certmanSubmit").val(_("Upload Certificate"));
		}else{
			$("#pkdiv").addClass("hidden");
			$("#cdiv").addClass("hidden");
			$("#certmanSubmit").val(_("Generate Certificate"));
		}
	});
	//CA Show/Hide
	$("#replaceCA").click(function(){
		$("#caexists").addClass('hidden');
		$("#caform").removeClass('hidden');
		$("#Submit").prop('disabled', false);
		$("#Reset").prop('disabled', false);
		$('#Delete').prop('disabled', false);
		$("#replace").val("replace");
	});
	if($("#hostname").is(":visible")) {
		$('#Submit').removeClass('hidden');
		$('#Reset').removeClass('hidden');
	}
	$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
	    var clicked = $(this).attr('href');
	    switch(clicked){
			case '#casettings':
				if($("#caexists").length) {
					$('#Delete').removeClass('hidden');
				}
				$('#Submit').removeClass('hidden');
				$('#Reset').removeClass('hidden');
				if($("#caexists").length > 0 && !$("#hostname").is(":visible")){
					$("#Submit").prop('disabled', true);
					$("#Reset").prop('disabled', true);
					$('#Delete').prop('disabled', true);
				} else if($("#hostname").is(":visible")) {
					$("#Submit").prop('disabled', false);
					$("#Reset").prop('disabled', false);
					$('#Delete').prop('disabled', false);
				}
			break;
			default:
				$('#Submit').addClass('hidden');
				$('#Reset').addClass('hidden');
				$('#Delete').addClass('hidden');
			break;
		}
	});
	$("#capage #caexistscheck").change(function() {
		if ($(this).is(":checked")) {
			$("#capage .selection button").prop("disabled", false);
		} else {
			$("#capage .selection button").prop("disabled", true);
		}
	});

	$(".fpbx-submit").submit(function(e) {
		if (e.target.id == "updatefw") {
			// We're not posting anything else, skip
			return true;
		}

		var stop = false,
				type = $("#certtype").val();
		$("form[name=frm_certman] input[type=\"text\"]").each( function(i, v) {
			if($(this).attr("name") == "ST" || $(this).attr("name") == "L" || $(this).attr("name") == "OU") {
				return true;
			}
			if ($(this).val() === "") {
				warnInvalid($(this),_("Can not be left blank!"));
				stop = true;
				return false;
			}
		});
		if(stop) {
			return false;
		}
		if(type == "le") {
			if($("#ST").val() === "") {
				warnInvalid($("#ST"),_("State can not be left blank!"));
				return false;
			}
			if($("#host").val() === "") {
				warnInvalid($("#host"),_("Host Name can not be left blank!"));
				return false;
			}
		} else {
			if($("#ST").val() === "" && $("#L").val() === "") {
				warnInvalid($("#ST"),_("State AND Locality Can not be left blank! One must be filled in!"));
				return false;
			}
		}

		if ($("form[name=frm_certman] input[type=\"password\"]").val() === "") {
			if (!confirm(_("Are you sure you dont want a passphrase?"))) {
				$("form[name=frm_certman] input[type=\"password\"]").focus();
				return false;
			}
		}
		if(type == "ss") {
			if($("#name").length) {
				var test = /^[a-z0-9]+$/i;
				if(!test.test($("#name").val())) {
					alert(_("Base Name must be alphanumeric only"));
					return false;
				}
			}
			if($("#hostname").val() === "") {
				warnInvalid($("#hostname"),_("Hostname can not be left blank!"));
				return false;
			}
		}

		$("#Submit").val(_("Generating... Please wait"));
		$("#Submit").prop("disabled", true);
		return true;
	});

	$(".deletecert").click(function(e) {
		if(!confirm(_("Are you sure you want to delete this certificate?"))) {
			e.stopPropagation();
			e.preventDefault();
		}
	});
});
