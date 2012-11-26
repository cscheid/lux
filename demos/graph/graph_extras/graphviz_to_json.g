/* outputs parts of a graph to a json format Facet understands */

BEG_G {
    printf("{\n");
    printf("    \"name\": \"G\",\n    \"type\": \"digraph\",\n");
    printf("    \"nodes\": [\n");
    int seen_node = 0, seen_edge = 0;
    $tvtype = TV_ne;
}

N {
    double x, y;
    printf("    ");
    if (seen_node == 0) {
        seen_node = 1;
    } else {
        printf(",");
    }
    printf("{ \"name\": \"%s\"", $.name);
    string attr = fstAttr($G, "N");
    while (1) {
        if (hasAttr($, attr)) {
            printf(", \"%s\": \"%s\"", attr, aget($, attr));
        }
        if (!(attr = nxtAttr($G, "N", attr)))
            break;
    };

    printf("}\n");
}

E {
    printf("    ");
    if (seen_edge == 0) {
        seen_edge = 1;
        printf("],\n");
        printf("    \"edges\": [\n");
    } else {
        printf(",");
    }
    printf("{\"source\": \"%s\", \"target\": \"%s\"}\n",
           $.tail.name, $.head.name);
}

END_G {
    printf("]\n");
    printf("}\n");
}
