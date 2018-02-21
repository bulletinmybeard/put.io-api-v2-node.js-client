Node.js Client for Put.io's API (V2)
===================================

// not finished yet

## Supported API endpoints

- [Account](#account)
- [Events](#events)
- [Files](#files)
- [Friends](#friends)
- [Transfers](#transfers)
- [Zips](#zips)

## Account
	Account.info();
	Account.retry();
	Account.settings();
	Account.settingsUpdate();

## Events
	Events.delete();
	Events.list();

## Files
	Files.createFolder();
	Files.delete();
    Files.deleteVideoPosition();
	Files.downloadUrl();
	Files.downloadUrls();
	Files.get();
	Files.getMp4();
	Files.list();
	Files.makeMp4();
	Files.move();
    Files.playlist();
	Files.rename();
    Files.search();
    Files.setVideoPosition();
    Files.share();
	Files.shared();
    Files.sharedWidth();
    Files.subtitles();
    Files.subtitlesDownload();
    Files.unshare();

## Friends
	Friends.approve();
	Friends.deny();
	Friends.list();
	Friends.request();
	Friends.unfriend();
	Friends.waitingRequests();

## Transfers
	Transfers.add();
	Transfers.cancel();
	Transfers.clean();
	Transfers.get();
	Transfers.list();
	Transfers.retry();

## Zips
	Zips.create();
	Zips.get();
	Zips.list();

## Examples

- [Files](#files)

## Files

```js
// Search for Star Wars..
Files.search('Star Wars');
// paginate to page 2 of the search result
Files.list('Star Wars', 2)
```
```js
Files.get(123456789)
// or
Files.get([123456789, 111234432])
```

```js
// Set video position for a video file 
Files.setVideoPosition(123456789, 3600000)
```

```js
// Share file with friends/all
Files.unshare(123456789, [123, 456])
// or
Files.unshare(123456789, 'everyone')
```

```js
Files.subtitlesDownload(123456789, 'eng')
// or
Files.subtitlesDownload(123456789, 'eng', 'srt')
```

```js
// List all the files (limited)
Files.list()

// Paginate to the second page of your list  
Files.list(2)
```

```js
// Creates the new folder in your root folder
Files.createFolder('just a new folder')

// Creates the new folder in a subfolder
Files.createFolder('just a new folder', 123456789)
```

```js
// Removes all items in the Object
helper.reduceObject({
    name: 'Robin',
    city: 'Den Haag',
    country: 'Netherlands'
}, ['city', 'country']);
```
```js
>> { name: 'Bobby' }
```

Works also the other way around...
```js
helper.reduceObject({
    name: 'Robin',
    city: 'Den Haag',
    country: 'Netherlands'
}, ['city', 'country'], true);
```
```js
>> { city: 'Den Haag', country: 'Netherlands' }
```