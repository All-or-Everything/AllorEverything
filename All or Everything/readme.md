# Dev Paradigms

## Fractal Refinement
Systems will be built out from short, relatively vague descriptions into structured frameworks, with a development path from general, overarching concepts -> specific, detailed frameworks. They can also start out as a problem (i.e. environmental degradation) or question (i.e. how do we find an optimal balance for this?) that needs to be addressed. There will be dynamic segmentation according to separation of function and also domains of description that each address an important question i.e. 'what does it do?', 'how does it work?', 'why should I care?', 'what could go wrong?'
## Systematic Design
We start with general concepts, goals, and ambitions. Then, with these in mind, we develop systems and then reflect on how well these systems fulfill said concepts, goals, and ambitions. Rinse and repeat until we have something that feels solid enough to support a society.
## Selective Specificity
We have no reason to be any more specific than the margin of error in our predictions. In this sense, it makes no sense to go into details that we can't be sure about. Avoiding extraneous details also makes it easier to focus on the flesh of the framework and stay out of the weeds, consolidating attention on the more impactful details. There are exceptions here which apply to controlled environments and proofs of concept, as well as design features which account for the range of contingency they're subject to.
## Full-Spectrum Superiority
To put it simply: If a domain of our existence can be leveraged, it will be leveraged, creating more robust, secure, and effective systems. This means maximizing the advantages that can be gained by [network effects](https://en.wikipedia.org/wiki/Network_effect), the allocation, coordination & integration of information, plus specialized & cross-domain expertise and knowledge.

# Dev Coordination System
We will be coordinating our efforts directly within the files themselves using formatting and structure, enabling asynchronous editing in all aspects of the architecture.

## Modular Proposal Standard

Each change or idea is posted as a collapsible block. The first tag is the author. Others can add their tags to show agreement.

Format:

```
<details>
<summary><strong> [ADDITION] (<a href="https://github.com/author">@author</a>, <a href="https://github.com/approving">@approving</a>, ... )</strong></summary>

Instructions/Context for following content as needed:

---
Your proposed text or change goes here.

---

</details>
```

Note that the `<a href="https://github.com/user">@user</a>` tag isn't strictly required, only advised, and can be substituted with just `@user` if it feels like too much.

Multiple types of tags can be used:
* `[ADDITION]` is for suggested additions. <br>
* `[REVISION}` is for suggested revisions. <br>
* `[REMOVAL]` is for suggested removals. <br>
* `[COMMENT]` is for comments. <br>
* `[SYNTHESIS]` is for standalone pieces worth integrating despite conflicts with the format of the systems as shown. <br>

Note that you can add your own tag types as needed if these don't suit your contribution.
* Leave one blank line after `<summary>` for correct rendering.

