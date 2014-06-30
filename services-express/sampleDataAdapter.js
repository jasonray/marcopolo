var _ = require('underscore');
var data = initializeSampleData();

// this is to be used until we attach 
// database for tracking real data
function initializeSampleData() {
	var d = [];

	d.push(initializeSampleIdea('a', 'ideaA', 'long description A', new Date('1/1/2014 12:34:56')));

	var ideaB = initializeSampleIdea('b', 'ideaB', 'long description B', new Date('1/2/2014 14:30:00'));
	// make user1 vote on this item
	d.push(ideaB);

	var itemC = initializeSampleIdea('c', 'ideaC', 'long description C', new Date('1/1/2014 08:03:00'));
	// add comments
	d.push(itemC);


	return d;
}

function initializeSampleIdea(id, short_description, long_description, createDate) {
	var item = {};
	item.id = id;
	item.short_description = short_description;
	item.long_description = long_description;
	item.voting_history = {};
	item.tags = [];
	item.suspended = false;
	item.comments = [];
	item.createDate = createDate;
	return item;
}

exports.fetchIdeas = fetchIdeas = function() {
	var resultData = [];
	_.each(data, function(rawItem) {
		var resultItem = convertFromDataToTransport(rawItem);
		resultData.push(resultItem);
	});
	return resultData;
};

function convertFromDataToTransport(dataItem) {
	console.log('converting from data to transport for ' + dataItem);
	if (!dataItem) return dataItem;

	var transport = {};
	transport.id = dataItem.id;
	transport.short_description = dataItem.short_description;
	transport.long_description = dataItem.long_description;
	transport.comment_count = dataItem.comments.length;
	transport.created = dataItem.createDate;
	return transport;
}

exports.fetchIdea = fetchIdea = function(id) {
	console.log('fetching single idea by id [%s]', id);
	var matchingRawItem = _.find(data, function(dataItem) {
		var matchingResult = (dataItem.id === id);
		console.log('comparing [%s][%s]=>[%s]', dataItem.id, id, matchingResult);
		return matchingResult;
	});
	console.log('find result => [%s]', matchingRawItem);
	return convertFromDataToTransport(matchingRawItem);
};