const feather = require('feather-icons')
const h = require('hyperscript')
const smoothPolyfill = require('smoothscroll-polyfill')

smoothPolyfill.polyfill()

const qs = document.querySelector.bind(document)
const qsa = document.querySelectorAll.bind(document)

// Loading animation
window.addEventListener('load', () => {
	const $overlay = qs('#loading-overlay')
	$overlay.classList.add('hide')
})

// Feather icons
feather.replace()

// Anchor smooth scroll
const $anchors = qsa('a')
for (const $a of $anchors) {
	if (!$a.href) {
		continue
	}

	const url = new URL($a.href)

	if (url.origin === window.location.origin) {
		$a.addEventListener('click', e => {
			e.preventDefault()
			const id = url.hash

			const to = {
				top: 0,
				left: 0,
				behavior: 'smooth'
			}

			if (url.hash.length > 0) {
				const $el = qs(id)
				$el.focus()
				to.top = $el.offsetTop
			}

			window.scrollTo(to)
		})
	}
}

// Easter egg
const nikerify = nikerified => {
	if (nikerified) {
		qs('#brand .picture img').style.transform = 'rotate(360deg)'

		qs('#lead-name').innerHTML = h('div',
			'Niker', h('span.text-regular', 'sify')).innerHTML

		qs('#brand-name').innerHTML = 'Niker'
	} else {
		qs('#brand .picture img').style.transform = 'rotate(0deg)'

		qs('#lead-name').innerHTML = h('div',
			'Maciej ', h('span.text-regular', 'Łaszcz')).innerHTML

		qs('#brand-name').innerHTML = 'Maciej'
	}
}

const $brand = qs('#brand')
$brand.addEventListener('click', e => {
	e.stopPropagation()
	e.preventDefault()

	const nikerified = window.localStorage.getItem('nikerified') === 'true'
	nikerify(!nikerified)

	window.localStorage.setItem('nikerified', !nikerified)
})

if (window.localStorage.getItem('nikerified') === 'true') {
	nikerify(true)
}

// NPM package versions
const $npms = qsa('[data-npm-version]')
const npmsEndpoint = 'https://api.npms.io/v2/package/'
for (const $npm of $npms) {
	const packageName = $npm.dataset.npmVersion
	$npm.innerText = '...'

	const url = npmsEndpoint + window.encodeURIComponent(packageName)

	const xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.responseType = 'json'
	xhr.onload = () => {
		if (xhr.status === 200) {
			try {
				$npm.innerText = xhr.response.collected.metadata.version
			} catch (err) {
				console.error(err)
			}
		}
	}
	xhr.send()
}

// Back to top
const $btt = qs('#back-to-top')
const $action = qs('section.action')
window.addEventListener('scroll', () => {
	if (window.scrollY + window.outerHeight - 350 > $action.offsetTop) {
		if (!$btt.classList.contains('show')) {
			$btt.classList.add('show')
		}
	} else if ($btt.classList.contains('show')) {
		$btt.classList.remove('show')
	}
})

// Copyright year (xd)
const $year = qs('#year')
$year.innerText = new Date().getFullYear()
