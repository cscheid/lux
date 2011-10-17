/* outputs parts of a graph to a json format HLGL understands */

BEG_G {
    printf("{\n");
    printf("    \"name\": \"G\",\n    \"type\": \"digraph\",\n");
    printf("    \"nodes\": [\n");
    int seen_node = 0, seen_edge = 0;
    $tvtype = TV_ne;
}

N {
    double x, y;
    sscanf($.pos, "%f,%f", &x, &y);
    printf("    ");
    if (seen_node == 0) {
        seen_node = 1;
    } else {
        printf(",");
    }
    printf("{\"position\": [%f,%f], \"name\": \"%s\"}\n",
           x, y, $.name);
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
