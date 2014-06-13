var _ = require('underscore');
var cartodbapi = require('./cartodbapi');
var plansmap = require('./plansmap');
var sidebar = require('./sidebar');

function addPlanContent($location, borough, planName) {
    $.get('plans/' + borough + '/' + planName.replace('/', '-'), function (content) {
        $location.append(content);
    });
}

function loadDetails(planName, success) {
    var sql = "SELECT * FROM plans WHERE name = '" + planName + "'";
    cartodbapi.getJSON(sql, function (results) {
        row = results.rows[0];
        success(row);
    });
}

function loadLots($target, planName) {
    var sql = 
        "SELECT p.borough AS borough, l.bbl AS bbl, l.block AS block, " +
            "l.lot AS lot, l.disposition_display AS disposition, " +
            "l.in_596 as in_596 " +
        "FROM lots l LEFT OUTER JOIN plans p ON l.plan_id=p.cartodb_id " +
        "WHERE p.name='" + planName + "' " +
        "ORDER BY l.block, l.lot";
    cartodbapi.getJSON(sql, function (data) {
        var lots_template = JST['handlebars_templates/lots.hbs'];
        var content = lots_template(data);
        $target.append(content);
        $('.lot-count').text(data.rows.length);
        $('.lot').on({
            mouseover: function () {
                plansmap.highlightLot($(this).data());
            },
            mouseout: function () {
                plansmap.unHighlightLot();
            }
        });
    });
}

function cleanData(row) {
    cleaned = _.extend({}, row);
    if (row.adopted) {
        // We want the year exactly as it appears in CartoDB, not modified for 
        // timezone
        cleaned.adopted = row.adopted.slice(0, row.adopted.indexOf('-'));
    }

    if (row.status) {
        if (row.status === 'active') {
            cleaned.status = 'active';
        }
        else if (row.status === 'expired') {
            cleaned.status = 'expired';
        }
        else {
            cleaned.status = 'unknown';
        }
    }
    return cleaned;
}

module.exports = {

    load: function ($target, options) {

        loadDetails(options.plan_name, function (row) {
            row = cleanData(row);

            // Load basic template for the plan
            var template = JST['handlebars_templates/plan.hbs'];
            templateContent = template(row);
            sidebar.open('#' + $target.attr('id'), templateContent);

            // Load details for the plan
            var $details = $target.find('#plan-details');
            addPlanContent($details, row.borough, options.plan_name);

            // Load the plan's lots
            loadLots($('#lots-content'), options.plan_name);
        });
    }

};
