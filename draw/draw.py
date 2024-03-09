#!/usr/bin/env python3
# -*- coding: utf8 -*-

__doc__ = """
Make the Secret Santa draw satisfying the given constraints.
"""

import argparse
import base64
import collections
import datetime
import json
import logging
import os
import random
import re
import sys

import matplotlib.pyplot as plt
import networkx as nx


logging.basicConfig(
    format="%(asctime)-15s [%(levelname)s] %(message)s",
    encoding="utf-8",
    level=logging.DEBUG,
)

Logger = logging.getLogger(__name__)

parser = argparse.ArgumentParser(description=__doc__)

DEFAULT_CONFIG_FILE = "./default.conf"
parser.add_argument(
    "--config",
    type=str,
    default=DEFAULT_CONFIG_FILE,
    help=f"Path to the configuration file. Default: {DEFAULT_CONFIG_FILE}",
)
parser.add_argument(
    "--plot",
    default=False,
    action="store_true",
    help="Plot the graph resulting from the configuration file. Default: False",
)
parser.add_argument(
    "--seed",
    default=datetime.datetime.now().year,
    type=int,
    help=f"Random seed used to make the draw deterministic. Default: {datetime.datetime.now().year}",
)
parser.add_argument(
    "--codes",
    default=None,
    type=str,
    help="Specify the output file where the codes you can distribute to will be written. This is only for your convencience.",
    # pairs.json contains the codes too
)

Sections = collections.namedtuple("Sections", ["Participants", "Constraints"])(
    Participants="[Participants]", Constraints="[Constraints]"
)


def strip_config_line(line: str) -> str:
    """\
    Strips comments and spaces from a line.

    Arguments
    ---------
        line: str
            The configuration line to be cleaned.

    Returns
    -------
        The configuration line without comments and stripped of any leading and trailing
        whitespaces.

    """

    # Comments starts after '#' character
    COMMENT_SEP = "#"

    if COMMENT_SEP in line:
        line = line[: line.index(COMMENT_SEP)]

    return line.strip()


def participant_parser(line: str, graph: nx.DiGraph) -> None:
    """\
    Parses one line of the Participants section and adds the participant's name as a
    graph vertex.

    Arguments
    ---------
        line: str
            The configuration line to parse. It should have already been preprocessed with
            function `strip_config_line`.

        graph: nx.DiGraph
            The graph object where the new node should be inserted.

    """

    Logger.debug("Parsing participant: %s", line)

    if "," in line:
        raise ValueError("Participant names must not contain commas")

    if line in graph.nodes:
        raise ValueError(f"Participant {line} already exists")

    graph.add_node(line)

    # Complete the graph
    for node in graph.nodes:
        if node != line:
            graph.add_edge(node, line)
            graph.add_edge(line, node)


def constraint_parser(line: str, graph: nx.DiGraph) -> None:
    """\
    Parses one line of the Constraints section and updates edges in the graph
    consequently.

    Arguments
    ---------
        line: str
            The configuration line to parse. It should have already been preprocessed with
            function `strip_config_line`.

        graph: nx.DiGraph
            The graph object where edges should be update.

    """

    Logger.debug("Parsing constraint: %s", line)

    FORCE_N_SEP = "/->"
    FORCE_Y_SEP = "-->"
    AUDIENCE_SEP = ","

    pattern = re.compile(
        f"^(.*?)({re.escape(FORCE_N_SEP)}|{re.escape(FORCE_Y_SEP)})(.*?)$"
    )

    match = pattern.match(line)
    if not match:
        raise ValueError(f"The constraint {line} does not match pattern {pattern}")

    subject, condition, audience = map(lambda _: _.strip(), match.groups())

    if condition not in [FORCE_N_SEP, FORCE_Y_SEP]:
        raise ValueError(
            f"The constraint {line} is invalid because {condition} is not a valid condition"
        )

    if subject not in graph.nodes:
        raise ValueError(
            f"The constraint {line} is invalid because {subject} is not a participant"
        )

    audience = set(map(lambda _: _.strip(), audience.split(AUDIENCE_SEP)))

    if any(aud not in graph.nodes for aud in audience):
        raise ValueError(
            (
                f"The constraint {line} is invalid because some of {audience} are not "
                f"participants"
            )
        )

    if condition == FORCE_N_SEP:
        # subject must not draw any from audience
        for aud in audience:
            if (subject, aud) in graph.edges:
                graph.remove_edge(subject, aud)

    else:
        # subject must not draw anyone but those in audience
        out_edges = list(graph.out_edges(subject))
        for _, aud in out_edges:
            if aud not in audience:
                graph.remove_edge(subject, aud)


def parse_configuration(filename: str) -> nx.DiGraph:
    """\
    Parses the configuration file into a graph

    Arguments
    ---------
        filename: str
            Name of the configuration file containing participants and constraints.

    Returns
    -------
        A directed graph where arc `(i, j)` represents that participant `i` is allowed
        to make a present to participant `j`.

    """

    actions = {
        Sections.Participants: participant_parser,
        Sections.Constraints: constraint_parser,
    }

    G = nx.DiGraph()

    current_action = lambda _, __: None

    with open(filename, "r") as conf:
        for line in conf:
            stripped_line = strip_config_line(line)

            if stripped_line == "":
                continue

            # When the section changes, update the `current_action`
            if stripped_line in actions:
                current_action = actions[stripped_line]

            # If the line is not a comment and not a new section, then perform the current
            # action on it
            else:
                current_action(stripped_line, G)

    return G


def reduce_deg2(graph: nx.DiGraph) -> nx.DiGraph:
    """\
    Reduce a directed graph so that every node has one and only one incoming edge
    and one and only one outgoing edge.

    FAQ
    ---
        - Is this the most efficient approach? No.
        - Is this an efficient implementation? No.
        - Do you care? No.

    Arguments
    ---------
        graph: nx.DiGraph
            The graph to be reduced.

    Returns
    -------
        A directed graph where every node has degree 2, and one incoming and one
        outgoing edge. Returns `None` if such reduction is infeasible.

    """

    import copy

    g = copy.deepcopy(graph)

    Logger.debug("Graph has %i nodes and %i edges", len(g.nodes), len(g.edges))

    if len(g.edges) == len(g.nodes):
        return g

    should_continue = True
    while should_continue:
        should_continue = False

        for node in random.sample(list(g.nodes), len(g.nodes)):
            out_edges = g.out_edges(node)
            in_edges = g.in_edges(node)

            if len(out_edges) == 0 or len(in_edges) == 0:
                return None

            if len(out_edges) > 1 and len(in_edges) > 1:
                continue

            if len(out_edges) == 1:
                # Because (node, other) is the only outgoing edge from node, we select it and
                # remove any other incoming edge to other
                node, other = next(_ for _ in out_edges)
                other_in_edges = list(g.in_edges(other))
                for f, t in other_in_edges:
                    if (f, t) != (node, other):
                        g.remove_edge(f, t)
                        # At least one edge was remved. So the external loop should attempt another scan
                        should_continue = True

            if len(in_edges) == 1:
                # Because (other, node) is the only incoming edge to node, we select it and
                # remove any other outgoing edge from other
                other, node = next(_ for _ in in_edges)
                other_out_edges = list(g.out_edges(other))
                for f, t in other_out_edges:
                    if (f, t) != (other, node):
                        # At least one edge was remved. So the external loop should attempt another scan
                        should_continue = True
                        g.remove_edge(f, t)

    # Either we found the solution...
    if len(g.edges) == len(g.nodes):
        return g

    # ... or we should branch
    for node in random.sample(list(g.nodes), len(g.nodes)):
        out_edges = list(g.out_edges(node))

        if len(out_edges) == 1:
            continue

        for node, other in out_edges:
            # Try selecting edge (node, other). If it fails, backtrack.
            removed_edges = set()
            for f, t in out_edges:
                if (f, t) != (node, other):
                    g.remove_edge(f, t)
                    removed_edges.add((f, t))

            reduced_g = reduce_deg2(g)

            # Success
            if reduced_g is not None:
                return reduced_g

            # Failure
            Logger.debug("Unsuccessful branch on (%s, %s)", node, other)
            for f, t in removed_edges:
                g.add_edge(f, t)

    return None


def graph_to_b64dict(d2graph: nx.DiGraph) -> tuple[list[dict], dict[str, str]]:
    """\
    Convert the resulting degree-2 graph into list of dicts of base64-encoded
    from/to.

    Arguments
    ---------
        d2graph: nx.DiGraph
            Degree-2 graph where edge (i, j) represents participant i making a present to
            participant j.

    Returns
    -------
        A pair of values where the first is a list of dictionaries containing
        information about who should make a present to who.

            {
                'code': '123456',
                'from': 'x',
                'to': 'y' (base64 encoded)
            }

        The second returned value is a map from people to their secret code.
    """

    pairs = []
    codes = {}

    for f, t in d2graph.edges:
        code = "".join(str(random.choice(range(10))) for _ in range(6))
        codes[f] = code
        pairs.append(
            {
                "code": code,
                "from": f,
                "to": base64.b64encode(t.encode()).decode(),
            }
        )

    return pairs, codes


if __name__ == "__main__":
    args = parser.parse_args()

    Logger.debug("Setting random seed to %s", args.seed)
    random.seed(args.seed)

    if not os.path.isfile(args.config):
        Logger.fatal("Configuration file %s does not exist", args.config)
        sys.exit(1)

    G = parse_configuration(args.config)
    Logger.info("Graph generation completed")

    if args.plot:
        pos = nx.spring_layout(G)
        nx.draw(G, pos)
        nx.draw_networkx_labels(G, pos)
        plt.show()

    reduced_g = reduce_deg2(G)
    Logger.info("Graph reduction completed")

    if reduced_g is None:
        Logger.error("Your constraints are not satisfiable")
        sys.exit(2)

    if args.plot:
        pos = nx.spring_layout(reduced_g)
        nx.draw(reduced_g, pos)
        nx.draw_networkx_labels(reduced_g, pos)
        plt.show()

    Logger.info("Encoding and dumping result as JSON")
    pairs, codes = graph_to_b64dict(reduced_g)

    if args.codes:
        with open(args.codes, "w") as f:
            f.write(json.dumps(codes, indent=2))

    print(json.dumps(pairs))
