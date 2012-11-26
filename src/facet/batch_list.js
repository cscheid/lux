Facet.batch_list = function(lst)
{
    lst = lst.slice().reverse();
    return {
        list: lst,
        draw: function() {
            var i=this.list.length;
            var lst = this.list;
            while (i--) {
                lst[i].draw();
            }
        }
    };
};
