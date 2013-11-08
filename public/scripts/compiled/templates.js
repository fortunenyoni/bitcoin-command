angular.module("bitcoinApp").run(["$templateCache", function($templateCache) {

  $templateCache.put("/templates/addressList.html",
    "<div class=\"row\"><div class=\"span12\"><tabset><tab heading=\"Active Addresses\"></tab><tab heading=\"Archived Addresses\" active=\"showArchived\"></tab></tabset><table class=\"table table-condensed\"><thead><tr><th class=\"address-label\">Label</th><th class=\"address-address\">Address</th><th>&nbsp;</th></tr></thead><tbody><tr ng-show=\"loading\"><td colspan=\"3\"><img src=\"/images/spinner.gif\" class=\"spinner\">&nbsp;&nbsp;Loading...</td></tr><tr ng-repeat=\"item in addresses | archived:showArchived | orderBy:'label' \"><td>{{ item.label }}</td><td>{{ item.address }} <a class=\"icon\" ng-href=\"{{ 'http://blockchain.info/address/' + item.address }}\"><i class=\"icon-external-link\"></i></a></td><td class=\"actions\"><a class=\"icon\" ng-click=\"qr(item)\" title=\"Show QR Code\"><i class=\"icon-dim icon-qrcode\"></i></a> <a class=\"icon\" ng-click=\"rename(item)\" title=\"Change Label\"><i class=\"icon-dim icon-tag\"></i></a> <a class=\"icon\" ng-click=\"toggleArchived(item)\" ng-hide=\"showArchived\" title=\"Archive Address\"><i class=\"icon-dim icon-archive\"></i></a> <a class=\"icon\" ng-click=\"toggleArchived(item)\" ng-show=\"showArchived\" title=\"Restore Address\"><i class=\"icon-dim icon-undo\"></i></a></td></tr></tbody></table></div></div>"
  );

  $templateCache.put("/templates/bootstrap/tabs/tab.html",
    "<li ng-class=\"{active: active, disabled: disabled}\"><a ng-click=\"select()\" tab-heading-transclude=\"\">{{heading}}</a></li>"
  );

  $templateCache.put("/templates/bootstrap/tabs/tabset-titles.html",
    "<ul class=\"nav {{type && 'nav-' + type}}\" ng-class=\"{'nav-stacked': vertical}\"></ul>"
  );

  $templateCache.put("/templates/bootstrap/tabs/tabset.html",
    "<div class=\"tabbable\" ng-class=\"{'tabs-right': direction == 'right', 'tabs-left': direction == 'left', 'tabs-below': direction == 'below'}\"><div tabset-titles=\"tabsAbove\"></div><div class=\"tab-content\"><div class=\"tab-pane\" ng-repeat=\"tab in tabs\" ng-class=\"{active: tab.active}\" tab-content-transclude=\"tab\"></div></div><div tabset-titles=\"!tabsAbove\"></div></div>"
  );

  $templateCache.put("/templates/bootstrap/typeahead/typeahead-match.html",
    "<a tabindex=\"-1\" ng-bind-html=\"match.label | typeaheadHighlight:query\"></a>"
  );

  $templateCache.put("/templates/bootstrap/typeahead/typeahead-popup.html",
    "<ul class=\"typeahead dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\"><li ng-repeat=\"match in matches\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\"><typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></typeahead-match></li></ul>"
  );

  $templateCache.put("/templates/changeLabel.html",
    "<div class=\"modal-header\"><h3>Label for <span class=\"not-bold\">{{ address }}</span></h3></div><div class=\"modal-body\"><div><input type=\"text\" class=\"span5\" id=\"prompt-value\" ng-model=\"label\" placeholder=\"New Label\" autofocus=\"\"></div><div>(previously was: '{{ initial }}')</div></div><div class=\"modal-footer\"><button ng-click=\"save()\" class=\"btn btn-success\">Change Label</button> <button ng-click=\"cancel()\" class=\"btn\">Cancel</button></div>"
  );

  $templateCache.put("/templates/dashboard.html",
    "<div class=\"row\"><div class=\"span7\"><div id=\"chart\"><div class=\"loading\">Loading...</div></div></div><div class=\"span5\"><div class=\"infobox-container\"><div class=\"infobox infobox-btc\"><div class=\"infobox-icon\"><i class=\"icon-bitcoin\"></i></div><div class=\"infobox-data\"><div class=\"infobox-value\">{{ wallet.balance | number:4 }}</div><div class=\"infobox-caption\">Wallet Balance</div></div><div class=\"infobox-data\"><div class=\"infobox-value\">{{ wallet.balance + wallet.savings | number:4 }}</div><div class=\"infobox-caption\">Total Bitcoins</div></div></div><div class=\"infobox infobox-usd\"><div class=\"infobox-icon\"><i class=\"icon-dollar\"></i></div><div class=\"infobox-data\"><div class=\"infobox-value\">{{ price.usd | currency:\"$\" }}</div><div class=\"infobox-caption\">Exchange Rate</div></div><div class=\"infobox-data\"><div class=\"infobox-value\">{{ (wallet.balance + wallet.savings) * price.usd | number:0 | prefix:'$'}}</div><div class=\"infobox-caption\">Total Value</div></div></div><div class=\"infobox infobox-speed\"><div class=\"infobox-icon\"><i class=\"icon-speed\"></i></div><div class=\"infobox-data\"><div class=\"infobox-value\">{{ mining.totalHashrate | hashrate }}</div><div class=\"infobox-caption\">Hashrate</div></div><div class=\"infobox-data\"><div class=\"infobox-value\">{{ wallet.earnRate | number:2 }}</div><div class=\"infobox-caption\">Actual BTC/day</div></div></div></div></div></div><div class=\"row\"><div class=\"span12\"><h1><i class=\"icon-bitcoin orange\"></i>&nbsp;Recent Transactions<div class=\"summary\">Wallet: <b>{{ wallet.balance | number:4 }}</b> BTC, Savings: <b>{{ wallet.savings | number:2 }}</b> BTC</div></h1><transaction-list transactions=\"wallet.transactions\"></div></div><div class=\"row\"><div class=\"span12\"><h1><i class=\"icon-cloud orange\"></i>&nbsp;Pools<div class=\"summary\">Expected per day (w/ 3% fee): <b>{{ mining.expectedRate | number:2 }}</b> / <b>{{ mining.expectedRate * price.usd | number:0 | prefix:'$' }}</b>, &nbsp;&nbsp; Actual per day: <b>{{ wallet.earnRate | number:2 }}</b> / <b>{{ wallet.earnRate * price.usd | number:0 | prefix:'$' }}</b></div></h1><table class=\"table table-condensed table-hover\"><thead><tr><th class=\"pool-activity\">&nbsp;</th><th class=\"pool-name\">Pool</th><th class=\"pool-hashrate\">Hash Rate</th><th class=\"pool-shares\">Shares</th><th class=\"pool-lastshare\">Last Share</th><th class=\"pool-reject\">% Rej</th><th class=\"pool-pending\">Pending</th><th class=\"pool-payouts\">Payouts</th><th class=\"pool-size\">Pool Size</th></tr></thead><tbody><tr ng-repeat=\"pool in mining.pools | orderBy:'name'\"><td class=\"pool-activity\"><div id=\"pool-{{ pool.name | safeId }}\" class=\"pulse pulse-pool\"></div></td><td class=\"pool-name\">{{ pool.name }}</td><td class=\"pool-hashrate\">{{ pool.hashrate | hashrate }}</td><td class=\"pool-shares\">{{ pool.shares | number:0 }}</td><td class=\"pool-lastshare\">{{ pool.lastShare | timeSince }}</td><td class=\"pool-reject\">{{ pool | rejectPercent }}</td><td class=\"pool-pending\">{{ pool.pending | number:4 }}</td><td class=\"pool-payouts\">{{ pool.payouts | number:2 }}</td><td class=\"pool-size\">{{ pool.poolSize | hashrate }}</td></tr></tbody></table></div></div><div class=\"row\"><div class=\"span12\"><h1><i class=\"icon-cogs orange\"></i>&nbsp;Devices</h1><div ng-repeat=\"(host, devices) in mining.devices\" class=\"device-host\"><div class=\"device-hostname\" id=\"host-{{ host | safeId }}\">{{ host }}</div><table class=\"table table-condensed table-hover\"><thead><tr><th class=\"device-activity\">&nbsp;</th><th class=\"device-id\">Device</th><th class=\"device-type\">Type</th><th class=\"device-rate\">Rate</th><th class=\"device-shares\">Shares</th><th class=\"device-reject\">% Rej</th><th class=\"device-pool\">Last Pool</th><th class=\"device-lastshare\">Last Share</th><th class=\"device-status\" ng-if=\"host != 'stratum-proxy'\">Status</th><th class=\"device-errors\" ng-if=\"host != 'stratum-proxy'\">HW</th><th class=\"device-temp\" ng-if=\"host != 'stratum-proxy'\">Temp</th><th class=\"device-warning\"></th></tr></thead><tbody><tr ng-repeat=\"device in devices\"><td class=\"device-activity\"><div id=\"device-{{ device.hostname + ':' + device.device | safeId }}\" class=\"pulse pulse-device\"></div></td><td class=\"device-id\">{{ device.device }}</td><td class=\"device-type\">{{ device.type }}</td><td class=\"device-rate\">{{ device.hashrate | hashrate }}</td><td class=\"device-shares\">{{ device.shares | number:0 }}</td><td class=\"device-reject\">{{ device | rejectPercent }}</td><td class=\"device-pool\">{{ device.lastPool }}</td><td class=\"device-lastshare\">{{ device.lastShare | timeSince }}</td><td class=\"device-status\" ng-if=\"host != 'stratum-proxy'\">{{ device.status }}</td><td class=\"device-errors\" ng-if=\"host != 'stratum-proxy'\">{{ device.errors | suffix:'%' }}</td><td class=\"device-temp\" ng-if=\"host != 'stratum-proxy'\">{{ device.temp | suffix:'°C':false }}</td><td class=\"device-warning\"></td></tr></tbody></table></div></div></div>"
  );

  $templateCache.put("/templates/directives/transactionList.html",
    "<table class=\"table table-condensed table-hover\" id=\"transactions\"><thead><tr><th class=\"tx-date\">Date</th><th class=\"tx-time\">Time</th><th class=\"tx-confirmed\">✓</th><th class=\"tx-description\">Description</th><th class=\"tx-amount\">Amount</th></tr></thead><tbody><tr ng-repeat=\"tx in transactions\" ng-class=\"{ confirmed: tx.confirmed, unconfirmed: !tx.confirmed }\"><td class=\"tx-date\">{{ tx.time * 1000 | date:'shortDate' }}</td><td class=\"tx-time\">{{ tx.time * 1000 | date:'shortTime' }}</td><td class=\"tx-confirmed\">{{ tx | confirmationCount }}</td><td class=\"tx-description\"><a ng-href=\"http://blockchain.info/tx/{{ tx.txid }}\">{{ tx | transactionDescription }}</a></td><td class=\"tx-amount\" ng-class=\"{ green: tx.amount > 0, red: tx.amount < 0 }\">{{ tx.amount | bitcoin }}</td></tr></tbody></table>"
  );

  $templateCache.put("/templates/login.html",
    "<h1>Please log in:</h1><form class=\"form\" ng-submit=\"login()\"><input type=\"hidden\" name=\"ReturnUrl\" value=\"@ViewBag.ReturnUrl\"><p class=\"text-error\">{{ error }}</p><input type=\"text\" ng-model=\"username\" class=\"input\" placeholder=\"Username\" autofocus=\"\" required=\"\">&nbsp;<input type=\"password\" ng-model=\"password\" class=\"input\" placeholder=\"Password\" required=\"\"><label class=\"checkbox\"><input type=\"checkbox\" ng-model=\"rememberMe\">Remember me</label><button type=\"submit\" class=\"btn\">Log in</button></form>"
  );

  $templateCache.put("/templates/messageBox.html",
    "<div class=\"modal-header\"><h3>{{ title }}</h3></div><div class=\"modal-body\"><p ng-bind-html=\"message\"></p></div><div class=\"modal-footer\"><button ng-repeat=\"btn in buttons\" ng-click=\"close(btn.result)\" class=\"btn\" ng-class=\"btn.cssClass\">{{ btn.label }}</button></div>"
  );

  $templateCache.put("/templates/newAddress.html",
    "<div class=\"modal-header\"><h3>{{ title }}</h3></div><div class=\"modal-body\"><div ng-show=\"state == 'prompt'\"><input type=\"text\" class=\"span5\" id=\"prompt-value\" ng-model=\"label\" placeholder=\"Address Label\" autofocus=\"\"></div><div ng-show=\"state == 'creating'\"><img src=\"/images/spinner.gif\">&nbsp;&nbsp;Creating Address...</div><div ng-show=\"state == 'created'\"><p>{{ address }} (<b>{{ label }}</b>)</p><p><img ng-src=\"http://chart.apis.google.com/chart?cht=qr&chld=Q|2&chs=200&chl={{ address }}\"></p></div><div ng-show=\"state == 'error'\" class=\"text-error\">An error occurred. Try again later.</div></div><div class=\"modal-footer\"><button ng-hide=\"state == 'created' || state == 'error'\" ng-disabled=\"state == 'creating'\" ng-click=\"create()\" class=\"btn btn-success\">Create Address</button> <button ng-hide=\"state == 'created' || state == 'error'\" ng-disabled=\"state == 'creating'\" ng-click=\"close()\" class=\"btn\">Cancel</button> <button ng-show=\"state == 'created' || state == 'error'\" ng-click=\"close()\" class=\"btn btn-success\">OK</button></div>"
  );

  $templateCache.put("/templates/poolEdit.html",
    "<div class=\"row\"><div class=\"span12\"><form ng-submit=\"save(pool)\" class=\"form-horizontal\"><fieldset><legend>Pool Details</legend><div class=\"control-group\"><label for=\"name\" class=\"control-label\">Name</label><div class=\"controls\"><input type=\"text\" id=\"name\" class=\"span3\" ng-model=\"pool.name\" required=\"\"></div></div><div class=\"control-group\"><label for=\"url\" class=\"control-label\">URL</label><div class=\"controls\"><input type=\"text\" id=\"url\" class=\"span7\" ng-model=\"pool.url\" required=\"\"></div></div><div class=\"control-group\"><label for=\"apiType\" class=\"control-label\">API Type</label><div class=\"controls\"><input type=\"text\" id=\"apiType\" class=\"span3\" ng-model=\"pool.apiType\"></div></div><div class=\"control-group\"><label for=\"apiKey\" class=\"control-label\">API Key</label><div class=\"controls\"><input type=\"text\" id=\"apiKey\" class=\"span7\" ng-model=\"pool.apiKey\"></div></div><div class=\"control-group\"><label for=\"payoutAddress\" class=\"control-label\">Payout Address</label><div class=\"controls\"><input type=\"text\" id=\"payoutAddress\" class=\"span7\" ng-model=\"pool.payoutAddress\"></div></div><div class=\"control-group\"><label for=\"payoutAliases\" class=\"control-label\">Payout Aliases</label><div class=\"controls\"><input type=\"text\" id=\"payoutAliases\" class=\"span3\" ng-model=\"pool.payoutAliases\"></div></div><div class=\"control-group\"><div class=\"controls\"><button id=\"save\" type=\"submit\" class=\"btn btn-success\">Save Settings</button> <button id=\"cancel\" onclick=\"history.back();return false\" class=\"btn\">Cancel</button></div></div></fieldset></form></div></div>"
  );

  $templateCache.put("/templates/pools.html",
    "<div class=\"row\"><div class=\"span12\"><h1>Pools</h1><table class=\"table table-condensed\"><thead><tr><th>Name</th><th>Url</th><th>Visible</th><th>&nbsp;</th></tr></thead><tbody><tr ng-repeat=\"pool in pools | orderBy:'name'\"><td>{{ pool.name }}</td><td>{{ pool.url }}</td><td class=\"center\"><a href=\"\" ng-click=\"toggleEnabled(pool)\"><i ng-class=\"{green: pool.enabled, 'icon-checkmark': pool.enabled, red: !pool.enabled, 'icon-close': !pool.enabled}\"></i></a></td><td><a href=\"\" ng-click=\"editPool(pool)\"><i class=\"icon-pencil\"></i></a> &nbsp; <a href=\"\" ng-click=\"deletePool(pool)\"><i class=\"icon-remove\"></i></a></td></tr></tbody></table></div></div>"
  );

  $templateCache.put("/templates/send.html",
    "<div class=\"row\"><div class=\"span12\"><form name=\"form\" valid-submit=\"send(tx)\" autocomplete=\"off\"><fieldset><legend>Send Bitcoins<div class=\"summary\">Available Balance: <b>{{ wallet.balance }}</b></div></legend><control-group for=\"address\"><div class=\"controls\" id=\"addressFields\"><input type=\"text\" name=\"address\" class=\"span4\" ng-model=\"tx.address\" placeholder=\"Address\" ng-required=\"true\" typeahead=\"item.address as item.name + ' - ' + item.address for item in recentRecipients | filter:$viewValue | limitTo:8\" typeahead-on-select=\"selectedAddress($item)\" autofocus=\"true\" ng-disabled=\"sending\"><validation-message for=\"address\" required=\"Address is required.\" pattern=\"Enter a valid bitcoin address\"></div></control-group><control-group for=\"name\"><div class=\"controls\"><input type=\"text\" name=\"name\" class=\"span4\" ng-model=\"tx.name\" placeholder=\"Name\" ng-disabled=\"sending\"></div></control-group><control-group for=\"amount\"><div class=\"controls\"><input type=\"text\" name=\"amount\" class=\"span2\" ng-model=\"tx.amount\" placeholder=\"Amount\" ng-pattern=\"/[-+]?[0-9]*\\.?[0-9]+/\" ui-validate=\"{ positive: 'positive($value)', balance: 'underBalance($value)' }\" ng-required=\"true\" ng-disabled=\"sending\"><validation-message for=\"amount\" required=\"Amount is required.\" pattern=\"Enter a valid number.\" positive=\"Amount must be &gt; 0.\" balance=\"Insufficient funds. Check your balance.\"></div></control-group><control-group for=\"comment\"><div class=\"controls\"><input type=\"text\" name=\"comment\" class=\"span4\" ng-model=\"tx.comment\" placeholder=\"Comment\" ng-disabled=\"sending\"></div></control-group><control-group for=\"passphrase\"><div class=\"controls\"><input type=\"password\" name=\"passphrase\" class=\"span4\" ng-model=\"tx.passphrase\" placeholder=\"Passphrase\" ng-required=\"true\" ng-disabled=\"sending\"><validation-message for=\"passphrase\" required=\"Enter your wallet passphrase.\"></div></control-group><div class=\"control-group\"><div class=\"controls\"><button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"sending\">Send</button> <button onclick=\"history.back();return false\" class=\"btn\" ng-disabled=\"sending\">Cancel</button></div></div><div ng-show=\"sending || error\" class=\"status-messages\"><div ng-hide=\"error\"><img src=\"/images/spinner.gif\" class=\"spinner\">&nbsp;&nbsp;Sending Transaction...</div><div ng-show=\"error\" class=\"text-error\">{{ error }}</div></div></fieldset></form></div></div>"
  );

  $templateCache.put("/templates/sign.html",
    "<div class=\"row\"><div class=\"span12\"><form name=\"form\" valid-submit=\"sign(msg)\" autocomplete=\"off\"><fieldset><legend>Sign Message</legend><control-group for=\"address\"><div class=\"controls\" id=\"addressFields\"><input type=\"text\" name=\"address\" class=\"span4\" ng-model=\"msg.address\" placeholder=\"Address\" ng-required=\"true\" typeahead=\"item.address as item.label + ' - ' + item.address for item in addresses | filter:{$:$viewValue, archived:false} | limitTo:8\" typeahead-on-select=\"selectedAddress($item)\" autofocus=\"true\" ng-disabled=\"signing\"><validation-message for=\"address\" required=\"Address is required.\" pattern=\"Enter a valid bitcoin address\"></div></control-group><control-group for=\"message\"><div class=\"controls\"><textarea rows=\"5\" name=\"message\" class=\"span8\" ng-model=\"msg.message\" placeholder=\"Message Text\" ng-required=\"true\" ng-disabled=\"signing\"></textarea><validation-message for=\"message\" required=\"Message is required.\" pattern=\"Enter a message to sign\"></div></control-group><control-group for=\"passphrase\"><div class=\"controls\"><input type=\"password\" name=\"passphrase\" class=\"span4\" ng-model=\"msg.passphrase\" placeholder=\"Passphrase\" ng-required=\"true\" ng-disabled=\"signing\"><validation-message for=\"passphrase\" required=\"Enter your wallet passphrase.\"></div></control-group><div class=\"control-group\"><div class=\"controls\"><button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"signing\">Sign Message</button> <button onclick=\"history.back();return false\" class=\"btn\" ng-disabled=\"signing\">Cancel</button></div></div><div ng-show=\"signing || error || signed\" class=\"status-messages\"><div ng-show=\"signing\"><img src=\"/images/spinner.gif\" class=\"spinner\">&nbsp;&nbsp;Signing Message...</div><div ng-show=\"error\" class=\"text-error\">{{ error }}</div><div ng-show=\"signed\"><pre class=\"message-signature\">-----BEGIN BITCOIN SIGNED MESSAGE-----\r" +
    "\n" +
    "{{ msg.message }}\r" +
    "\n" +
    "-----BEGIN BITCOIN SIGNATURE-----\r" +
    "\n" +
    "Address: {{ msg.address }}\r" +
    "\n" +
    "Signature: {{ signature }}\r" +
    "\n" +
    "-----END BITCOIN SIGNATURE-----</pre></div></div></fieldset></form></div></div>"
  );

  $templateCache.put("/templates/wallet.html",
    "<div class=\"row\"><div class=\"span12\"><h1><i class=\"icon-bitcoin orange\"></i>&nbsp;Transactions<div class=\"summary\">Balance: <b>{{ wallet.balance | number:4 }}</b>&nbsp;BTC</div></h1><div class=\"button-bar\"><a class=\"btn btn-small\" href=\"#/wallet/send\"><i class=\"icon-arrow-right\"></i>&nbsp;Send Bitcoins</a> <a class=\"btn btn-small\" href=\"#/wallet/sign\"><i class=\"icon-locked\"></i>&nbsp;Sign Message</a> <a class=\"btn btn-small\" href=\"\" ng-click=\"newAddress()\"><i class=\"icon-plus\"></i>&nbsp;New Address</a>&nbsp;<div class=\"btn-group\"><a class=\"btn btn-small\" href=\"#/wallet/addresses\"><i class=\"icon-th-list\"></i>&nbsp;List Addresses</a></div></div><p class=\"table-footer muted\"><span ng-show=\"wallet.more && count != 'all'\">Last {{ count }} transactions shown.</span> <span ng-hide=\"wallet.more && count != 'all'\">All transactions shown.</span> Show <a href=\"\" ng-click=\"show(50)\">50</a>, <a href=\"\" ng-click=\"show(100)\">100</a>, <a href=\"\" ng-click=\"show(250)\">250</a>, <a href=\"\" ng-click=\"show(500)\">500</a>, <a href=\"\" ng-click=\"show(1000)\">1000</a>, or <a href=\"\" ng-click=\"show('all')\">all</a> transactions.</p><transaction-list transactions=\"wallet.transactions\"><div>odd</div></div></div>"
  );

}]);
