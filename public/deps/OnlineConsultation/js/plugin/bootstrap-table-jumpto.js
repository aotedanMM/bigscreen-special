/**
 * @author Jay <jwang@dizsoft.com>
 */

(function ($) {
    'use strict';
    var sprintf = $.fn.bootstrapTable.utils.sprintf;

    $.extend($.fn.bootstrapTable.defaults, {
        showJumpto: false,
        exportOptions: {}
    });

    $.extend($.fn.bootstrapTable.locales, {
        formatJumpto: function () {
            return '确定';
        }
    });
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initPagination = BootstrapTable.prototype.initPagination;

    BootstrapTable.prototype.initPagination = function () {
        _initPagination.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.showJumpto) {
            var that = this,
                $pageGroup = this.$pagination.find('ul.pagination'),
                $jumpto = $pageGroup.find('li.jumpto');

            if (!$jumpto.length) {
                var pages=that.totalPages;
                var myPaginationDetail = "共"+pages+"页";
                $jumpto = $([
                    '<li class="jumpto">'
                    +myPaginationDetail+
                    '  到',
                    '<input type="text" class="form-control">',
                    '页',
                    '<button class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    '" title="' + this.options.formatJumpto() + '" ' +
                    ' type="button">'+this.options.formatJumpto(),
                    '</button>',
                    '</li>'].join('')).appendTo($pageGroup);

                $jumpto.find('button').click(function () {
                    that.selectPage(parseInt($jumpto.find('input').val()));
                });
            }
        }
    };
})(jQuery);