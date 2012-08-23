Facet.conditional_batch = function(batch, condition)
{
    return {
        draw: function() {
            if (condition()) batch.draw();
        }
    };
};
