'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var C__Users_HAOUARI_Desktop_Notes_NotesTest__obsidian_plugins_obsidianTextExtract_node_modules_removeMarkdown = function(md, options) {
  options = options || {};
  options.listUnicodeChar = options.hasOwnProperty('listUnicodeChar') ? options.listUnicodeChar : false;
  options.stripListLeaders = options.hasOwnProperty('stripListLeaders') ? options.stripListLeaders : true;
  options.gfm = options.hasOwnProperty('gfm') ? options.gfm : true;
  options.useImgAltText = options.hasOwnProperty('useImgAltText') ? options.useImgAltText : true;

  var output = md || '';

  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '');

  try {
    if (options.stripListLeaders) {
      if (options.listUnicodeChar)
        output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, options.listUnicodeChar + ' $1');
      else
        output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, '$1');
    }
    if (options.gfm) {
      output = output
        // Header
        .replace(/\n={2,}/g, '\n')
        // Fenced codeblocks
        .replace(/~{3}.*\n/g, '')
        // Strikethrough
        .replace(/~~/g, '')
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, '');
    }
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, options.useImgAltText ? '$1' : '')
      // Remove inline links
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, '$1$2$3')
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
      // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      .replace(/\n{2,}/g, '\n\n');
  } catch(e) {
    console.error(e);
    return md;
  }
  return output;
};

function inlineLog(str) {
    console.log(str);
    return str;
}
var SearchPP = /** @class */ (function (_super) {
    __extends(SearchPP, _super);
    function SearchPP() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delay = 2000;
        _this.textExtraction = "Activated";
        _this.defaultSize = 30;
        return _this;
    }
    SearchPP.prototype.onload = function () {
        var _this = this;
        this.addSettingTab(new SettingTab(this.app, this));
        console.log('Loading insert search results plugin');
        var config = [
            {
                id: 'editor:insertSearchResultsFormated',
                name: 'Insert search results Formated',
                formatTitle: function (ele) { return "# " + ele.file.name + " (" + ele.result.content.length + ")" + "\n" + "[[" + ele.file.name + "]]" + "\n"; },
                formatResults: function (str, start, end) { return "## ..." + C__Users_HAOUARI_Desktop_Notes_NotesTest__obsidian_plugins_obsidianTextExtract_node_modules_removeMarkdown(str.substring(start, end).replace("\n", " ")) + "...\n"; },
                formatContent: function (str, start, end) { return C__Users_HAOUARI_Desktop_Notes_NotesTest__obsidian_plugins_obsidianTextExtract_node_modules_removeMarkdown(str.substring(start, end).replace("\n", " ")); },
                postResults: function () { _this.app.commands.commands["editor:fold-all"].checkCallback(); }
            },
            {
                id: 'editor:insertSearchResultsNotFormated',
                name: 'Insert search results not formated',
                formatTitle: function (ele) { return ele.file.name + " (" + ele.result.content.length + ")" + "\n" + "[[" + ele.file.name + "]]" + "\n"; },
                formatResults: function (str, start, end) { return C__Users_HAOUARI_Desktop_Notes_NotesTest__obsidian_plugins_obsidianTextExtract_node_modules_removeMarkdown(str.substring(start, end).replace("\n", " ")) + "...\n"; },
                formatContent: function (str, start, end) { return C__Users_HAOUARI_Desktop_Notes_NotesTest__obsidian_plugins_obsidianTextExtract_node_modules_removeMarkdown(str.substring(start, end).replace("\n", " ")); },
                postResults: function () { }
            },
            {
                id: 'editor:insertSearchResultContent',
                name: 'Insert search results content',
                formatTitle: function (ele) { return ""; },
                formatResults: function (str, start, end) { return ""; },
                formatContent: function (str, start, end) { return C__Users_HAOUARI_Desktop_Notes_NotesTest__obsidian_plugins_obsidianTextExtract_node_modules_removeMarkdown(str.substring(start, end).replace("\n", " ")); },
                postResults: function () { }
            }
        ];
        var reformatLinks = function (links, config, size) {
            var currentView = _this.app.workspace.activeLeaf.view;
            var query = _this.app.workspace.getLeavesOfType('search')[0].view.searchQuery.query.replace(/^"(.*)"$/, '$1');
            links.sort(function (a, b) { return b.result.content.length - a.result.content.length; });
            return links.filter(function (ele) { return ele.file.name !== currentView.file.name; }).map(function (ele) {
                var titleSize = 20;
                var extractedText = "";
                if (_this.textExtraction == "Activated") {
                    extractedText = config.formatTitle(ele);
                    var minIndex_1 = 9999999;
                    var maxIndex_1 = 0;
                    ele.result.content.forEach(function (position) {
                        var minTitle = Math.max(position[0] - titleSize, 0);
                        var maxTitle = Math.min(position[1] + titleSize, ele.content.length - 1);
                        var min = Math.max(position[0] - size, 0);
                        var max = Math.min(position[1] + size, ele.content.length - 1);
                        // console.log({min,max,minIndex,maxIndex})
                        if (!((min >= minIndex_1 && min <= maxIndex_1) || (max >= minIndex_1 && max <= maxIndex_1))) {
                            minIndex_1 = Math.min(minIndex_1, position[0]);
                            maxIndex_1 = Math.max(maxIndex_1, position[1]);
                            extractedText += config.formatResults(ele.content, minTitle, maxTitle);
                            //console.log(ele.content.substring(min,max));
                            extractedText += config.formatContent(ele.content, min, max);
                        }
                    });
                }
                return extractedText;
            }).join('\n');
        };
        function getLastLineNum(doc, line) {
            if (line === void 0) { line = 0; }
            var lineNum = line === 0
                ? doc.getCursor().line
                : line;
            if (doc.lineCount() === lineNum) {
                return doc.getCursor().line + 1;
            }
            return doc.getLine(lineNum) === '---'
                ? lineNum
                : getLastLineNum(doc, lineNum + 1);
        }
        var initExpander = function (config) {
            // Search files
            var cmDoc =  null;
            // @ts-ignore
            var globalSearchFn = _this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch.bind(_this);
            var search = function (query) { return globalSearchFn(inlineLog(query)); };
            var getFoundFilenames = function (config, callback, size) {
                var searchLeaf = _this.app.workspace.getLeavesOfType('search')[0];
                console.log("searchLeaf", searchLeaf);
                searchLeaf.open(searchLeaf.view)
                    .then(function (view) { return setTimeout(function () {
                    // Using undocumented feature
                    // @ts-ignore
                    var result = reformatLinks(view.dom.resultDoms, config, size);
                    callback(result);
                    config.postResults();
                }, _this.delay); });
            };
            var currentView = _this.app.workspace.activeLeaf.view;
            if (currentView instanceof obsidian.MarkdownView) {
                cmDoc = currentView.sourceMode.cmEditor;
            }
            var hasFormulaRegexp = /^\{\{.+\}\}.*/;
            var curNum = cmDoc.getCursor().line;
            var curText = cmDoc.getLine(curNum);
            if (!hasFormulaRegexp.test(curText)) {
                return;
            }
            var isEmbed = cmDoc.getLine(curNum - 1) === '```expander'
                && cmDoc.getLine(curNum + 1) === '```';
            var fstLineNumToReplace = isEmbed
                ? curNum - 1
                : curNum;
            var lstLineNumToReplace = isEmbed
                ? getLastLineNum(cmDoc)
                : curNum;
            var searchQuery = curText.replace('{{', '').replace('}}', '');
            var size = _this.defaultSize;
            if (searchQuery.indexOf("/") !== -1) {
                size = +searchQuery.split("/")[1];
                searchQuery = searchQuery.split("/")[0];
            }
            var embedFormula = '```expander\n' +
                '{{' + searchQuery + '}}\n' +
                '```\n';
            var replaceLine = function (content) { return cmDoc.replaceRange(embedFormula + content + '\n\n', { line: fstLineNumToReplace, ch: 0 }, { line: lstLineNumToReplace, ch: cmDoc.getLine(lstLineNumToReplace).length }); };
            search(inlineLog(searchQuery));
            getFoundFilenames(config, replaceLine, size);
        };
        config.forEach(function (e) {
            _this.addCommand({
                id: e.id,
                name: e.name,
                callback: function () { return initExpander(e); },
                hotkeys: []
            });
        });
    };
    SearchPP.prototype.onunload = function () {
        console.log('unloading plugin');
    };
    return SearchPP;
}(obsidian.Plugin));
var SettingTab = /** @class */ (function (_super) {
    __extends(SettingTab, _super);
    function SettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.app = app;
        _this.plugin = plugin;
        return _this;
    }
    SettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Search++' });
        new obsidian.Setting(containerEl)
            .setName('Delay')
            .setDesc('Search++ don\' wait until search completed. It waits for a delay and paste result after that.')
            .addSlider(function (slider) {
            slider.setLimits(1000, 10000, 1000);
            slider.setValue(_this.plugin.delay);
            slider.onChange(function (value) { return _this.plugin.delay = value; });
            slider.setDynamicTooltip();
        });
        new obsidian.Setting(containerEl)
            .setName('Text Extraction')
            .setDesc('Add extracted text to the found results.')
            .addDropdown(function (cb) {
            cb.addOption("Activated", "Activated");
            cb.addOption("Disabled", "Disabled");
            cb.setValue(_this.plugin.textExtraction);
            cb.onChange(function (value) { return _this.plugin.textExtraction = value; });
        });
        new obsidian.Setting(containerEl)
            .setName('Default Size')
            .setDesc('The number of the chars to extract before and after the found text')
            .addText(function (text) {
            text.setValue(_this.plugin.defaultSize.toString());
            text.onChange(function (value) { return _this.plugin.defaultSize = +value; });
        });
    };
    return SettingTab;
}(obsidian.PluginSettingTab));

module.exports = SearchPP;


/* nosourcemap */