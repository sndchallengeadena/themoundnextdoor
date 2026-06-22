window.onload = function () {loadSetupAndLanguage();}

function loadSetupAndLanguage() {
    fetch('setup.json')
        .then(response => response.json())
        .then(setupData => {
            if (!setupData || (Array.isArray(setupData) && setupData.length === 0) || (typeof setupData === 'object' && Object.keys(setupData).length === 0)) {
                addcontent();
                return;
            }
            const setup = Array.isArray(setupData) ? setupData[0] : setupData;
            
            fetch('data/languaje.json')
                .then(response => response.json())
                .then(langData => {
                    const langObj = langData.find(l => l.language_code === setup.language) || langData.find(l => l.language_code === 'en') || {};
                    const footerIntro = document.querySelector('.footer-intro');
                    if (footerIntro && langObj.footer_intro) {
                        footerIntro.innerHTML = langObj.footer_intro;
                    }
                    const footerNote = document.querySelector('.g-centered.footer-note');
                    if (footerNote && langObj.footer_note) {
                        footerNote.innerHTML = langObj.footer_note;
                    }
                })
                .finally(() => {
                    addcontent();
                });
        })
        .catch(() => {
            addcontent();
        });
}

function addcontent() {
    fetch('data/project.json')
        .then(response => response.text())
        .then(text => {
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = [];
            }
            if (!Array.isArray(data) || data.length === 0) {
                return fetch('data/demo.json')
                    .then(response => response.json());
            }
            return data;
        })
        .then(data => {
            const container = document.getElementById('main-container');
            let lastHeadlineWrapper = null;
            
            const universityFooter = document.querySelector('.footer-logo.university');
            const universityItem = data.find(item => item.type === 'university');
            if (universityFooter && universityItem && universityItem.credit) {
                const logoImg = document.createElement('img');
                logoImg.src = `images/${universityItem.credit}`;
                logoImg.alt = universityItem.content;
                universityFooter.appendChild(logoImg);
                const uniName = document.createElement('h2');
                uniName.textContent = universityItem.content;
                universityFooter.appendChild(uniName);
            }
            
            data.forEach(item => {
                let el;
                let wrapper;
                switch (item.type) {
                    case 'university':
                        if (lastHeadlineWrapper) {
                            const universityEl = document.createElement('h5');
                            universityEl.className = 'university';
                            universityEl.innerHTML = item.content;
                            lastHeadlineWrapper.insertBefore(universityEl, lastHeadlineWrapper.firstChild);
                        }
                        break;
                    case 'photo':
                        wrapper = document.createElement('div');
                        wrapper.classList.add('g-media');
                        wrapper.classList.add('g-photo-wrapper');

                        if (item.content === 'Map.png') {
                            wrapper.classList.add('interactive-map-holder');
                            
                            // --- ORIGINAL DESKTOP MAP IMAGE ---
                            el = document.createElement('img');
                            el.src = `images/${item.content}`;
                            el.alt = item.alt || 'Interactive Adena Mound Map Layout';
                            el.style.width = '100%';
                            el.style.display = 'block';
                            el.className = 'desktop-map-img';
                            wrapper.appendChild(el);

                            const tooltip = document.createElement('div');
                            tooltip.className = 'map-hover-tooltip';
                            wrapper.appendChild(tooltip);

                            const mapMoundsData = [
                                {"top": "50.5%", "left": "39.7%", "title": "Hartman Mound", "info": "Largest and best preserved in The Plains."},
                                {"top": "49%", "left": "24%", "title": "Woodruff/Connett Mounds", "info": "Second-largest standing mound in The Plains."},
                                {"top": "51.5%", "left": "24.3%", "title": "Connett Mounds 3 & 4", "info": "Series of small excavated mounds."},
                                {"top": "72.6%", "left": "41.7%", "title": "Beard/Baird/Coon Mound", "info": "Destroyed in 1930 and had significant artifacts like mica, copper, and marine shells."},
                                {"top": "78%", "left": "43%", "title": "Armitage Mound", "info": "Once large, later cleared for new construction."},
                                {"top": "74.3%", "left": "47.3%", "title": "Martin Mound #2", "info": "Now built over, the base is still visible, and excavation uncovered a child's grave."},
                                {"top": "74.3%", "left": "52.1%", "title": "Martin’s “Schoolhouse” Mound", "info": "A school was built on the mound in 1875, now sits on a private residence."},
                                {"top": "76.8%", "left": "76.7%", "title": "Dorr Mound #2", "info": "Purchased by the Archaeological Conservancy in 2008 for protection."},
                                {"top": "82.2%", "left": "76.2%", "title": "Dorr Mound #1", "info": "Next to Dorr Mound #2."},
                                {"top": "80.8%", "left": "61.15%", "title": "Zenner Meadows Mound", "info": "Sits on a high terrace above the Hocking River."},
                                {"top": "79.2%", "left": "61%", "title": "School Fort Ring/Sacred Circle", "info": "Destroyed during local high school construction."},
                                {"top": "89.4%", "left": "68.3%", "title": "3 Sacred Circles & 2 Mounds", "info": "Earthen monumental cluster tracking regional ancient alignments."},
                                {"top": "88.5%", "left": "79.3%", "title": "Large Sacred Circle", "info": "There is limited confirmed knowledge about the sacred circles. These circles typically feature an interior ditch that followed the curve of the surrounding earthen wall, along with a single causewayed entrance."}
                            ];

                            mapMoundsData.forEach(mound => {
                                const pin = document.createElement('div');
                                pin.className = 'map-hotspot-pin';
                                pin.style.top = mound.top;
                                pin.style.left = mound.left;

                                const showTooltip = () => {
                                    tooltip.innerHTML = `<strong>${mound.title}</strong>${mound.info}`;
                                    tooltip.classList.add('visible');
                                };

                                pin.addEventListener('mouseenter', showTooltip);

                                pin.addEventListener('mousemove', (e) => {
                                    if (window.innerWidth > 768) {
                                        const wrapperRect = wrapper.getBoundingClientRect();
                                        const x = e.clientX - wrapperRect.left + 15;
                                        const y = e.clientY - wrapperRect.top + 15;
                                        tooltip.style.left = `${x}px`;
                                        tooltip.style.top = `${y}px`;
                                    }
                                });

                                pin.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    showTooltip();
                                });

                                pin.addEventListener('mouseleave', () => {
                                    tooltip.classList.remove('visible');
                                });

                                wrapper.appendChild(pin);
                            });

                            document.addEventListener('click', () => {
                                tooltip.classList.remove('visible');
                            });

                            // --- MOBILE STATIC REPLACEMENT ---
                            const mobileContainer = document.createElement('div');
                            mobileContainer.className = 'mobile-static-map-wrapper';

                            const mobileImg = document.createElement('img');
                            mobileImg.src = 'images/MapMobile.png';
                            mobileImg.alt = 'Static Map of Ancient Adena Mounds in The Plains';
                            
                            mobileContainer.appendChild(mobileImg);
                            wrapper.appendChild(mobileContainer);

                        } else {
                            el = document.createElement('img');
                            el.src = `images/${item.content}`;
                            el.alt = item.alt || '';
                            el.style.width = '100%';
                            wrapper.appendChild(el);
                        }

                        if (item.max_size && item.max_size !== 'body') {
                            wrapper.style.maxWidth = item.max_size + 'px';
                        } else if (item.max_size === 'body') {
                            wrapper.classList.add('body-size');
                        }

                        if (item.credit) {
                            const creditEl = document.createElement('p');
                            creditEl.innerHTML = item.credit;
                            creditEl.className = 'g-credit';
                            wrapper.appendChild(creditEl);
                        }
                        container.appendChild(wrapper);
                        lastHeadlineWrapper = null;
                        break;
                    case 'headline':
                        wrapper = document.createElement('div');
                        wrapper.className = 'headline-wrapper';
                        el = document.createElement('h1');
                        el.textContent = item.content;
                        wrapper.appendChild(el);
                        if (item.max_size && item.max_size !== 'body') {
                            wrapper.style.maxWidth = item.max_size;
                        } else if (item.max_size === 'body') {
                            wrapper.classList.add('body-size');
                        }
                        container.appendChild(wrapper);
                        lastHeadlineWrapper = wrapper;
                        break;
                    case 'bylines':
                        if (lastHeadlineWrapper) {
                            const bylineEl = document.createElement('div');
                            bylineEl.className = 'bylines';
                            const byspan = document.createElement('span');
                            byspan.className = 'g-by';
                            byspan.innerHTML = item.content + '&nbsp;';
                            bylineEl.appendChild(byspan);
                            if (item.credit) {
                                const namesSpan = document.createElement('span');
                                namesSpan.className = 'g-names';
                                namesSpan.innerHTML = item.credit;
                                bylineEl.appendChild(namesSpan);
                            }
                            if (item.max_size) {
                                bylineEl.style.maxWidth = item.max_size;
                            }
                            const h1 = lastHeadlineWrapper.querySelector('h1');
                            if (h1 && h1.nextSibling) {
                                lastHeadlineWrapper.insertBefore(bylineEl, h1.nextSibling);
                            } else {
                                lastHeadlineWrapper.appendChild(bylineEl);
                            }
                        }
                        break;
                    case 'subhead':
                        wrapper = document.createElement('div');
                        el = document.createElement('h2');
                        el.textContent = item.content;
                        wrapper.appendChild(el);
                        if (item.max_size && item.max_size !== 'body') {
                            wrapper.style.maxWidth = item.max_size;
                        } else if (item.max_size === 'body') {
                            wrapper.className = 'body-size';
                        }
                        container.appendChild(wrapper);
                        lastHeadlineWrapper = null;
                        break;
                    case 'text':
                        wrapper = document.createElement('div');
                        el = document.createElement('p');
                        el.innerHTML = item.content;
                        if (item.max_size && item.max_size !== 'body') {
                            wrapper.style.maxWidth = item.max_size;
                        } else if (item.max_size === 'body') {
                            wrapper.classList.add('body-size');
                        }
                        wrapper.appendChild(el);
                        container.appendChild(wrapper);
                        lastHeadlineWrapper = null;
                        break;
                    case 'graphic':
                        wrapper = document.createElement('div');
                        wrapper.className = 'graphic-wrapper';
                        wrapper.classList.add('g-media');
                        if (item.max_size && item.max_size !== 'body') {
                            wrapper.style.maxWidth = item.max_size + 'px';
                        } else if (item.max_size === 'body') {
                            wrapper.className += ' media-size';
                        }
                        fetch(`graphics/${item.content}.html`)
                            .then(response => response.text())
                            .then(html => {
                                wrapper.innerHTML = html;
                                if (item.credit) {
                                    const creditEl = document.createElement('p');
                                    creditEl.innerHTML = item.credit;
                                    creditEl.className = 'g-credit';
                                    wrapper.appendChild(creditEl);
                                }
                            })
                            .catch(error => {
                                wrapper.innerHTML = '<p>Error loading graphic.</p>';
                            });
                        container.appendChild(wrapper);
                        lastHeadlineWrapper = null;
                        break;
                    case 'video':
                        wrapper = document.createElement('div');
                        wrapper.classList.add('g-video-wrapper');
                        
                        if (item.max_size && item.max_size !== 'body') {
                            wrapper.style.maxWidth = item.max_size + 'px';
                        } else if (item.max_size === 'body') {
                            wrapper.className = 'media-size';
                        }

                        if (item.content.includes('youtube.com') || item.content.includes('youtu.be')) {
                            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                            const match = item.content.match(regExp);
                            const videoId = (match && match[2].length === 11) ? match[2] : null;

                            el = document.createElement('iframe');
                            if (videoId) {
                                el.src = `https://www.youtube.com/embed/${videoId}`;
                            } else {
                                console.error('Could not parse YouTube ID from:', item.content);
                            }
                            el.width = '100%';
                            el.height = '450';
                            el.frameBorder = '0';
                            el.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                            el.allowFullscreen = true;
                        } else {
                            el = document.createElement('video');
                            el.src = `media/${item.content}`;
                            el.controls = true;
                            el.style.width = '100%';
                        }

                        wrapper.appendChild(el);

                        if (item.credit) {
                            const creditEl = document.createElement('p');
                            creditEl.innerHTML = item.credit;
                            creditEl.className = 'g-credit';
                            wrapper.appendChild(creditEl);
                        }
                        container.appendChild(wrapper);
                        lastHeadlineWrapper = null;
                        break;
                    case 'iframe':
                        wrapper = document.createElement('div');
                        wrapper.classList.add('frames-wrapper');
                        wrapper.innerHTML = item.content;
                        if (item.max_size && item.max_size !== 'body') {
                            wrapper.style.maxWidth = item.max_size;
                        } else if (item.max_size === 'body') {
                            wrapper.classList.add('body-size');
                        }
                        if (item.credit) {
                            const creditEl = document.createElement('p');
                            creditEl.innerHTML = item.credit;
                            creditEl.className = 'g-credit';
                            wrapper.appendChild(creditEl);
                        }
                        container.appendChild(wrapper);
                        lastHeadlineWrapper = null;
                        break;
                    case 'embed':
                        wrapper = document.createElement('div');
                        wrapper.className = 'embed-wrapper';
                        if (item.max_size && item.max_size !== 'body') {
                            wrapper.style.maxWidth = item.max_size + 'px';
                        } else if (item.max_size === 'body') {
                            wrapper.className += ' media-size';
                        }
                        fetch(`embeds/${item.content}/index.html`)
                            .then(response => response.text())
                            .then(html => {
                                const parser = new DOMParser();
                                doc = parser.parseFromString(html, 'text/html');

                                doc.querySelectorAll('head > style').forEach(style => {
                                    wrapper.appendChild(style.cloneNode(true));
                                });

                                const bodyContent = doc.body.innerHTML;
                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = bodyContent;
                                Array.from(tempDiv.children).forEach(child => {
                                    if (child.tagName.toLowerCase() !== 'script') {
                                        wrapper.appendChild(child);
                                    }
                                });

                                doc.querySelectorAll('body > script').forEach(oldScript => {
                                    const newScript = document.createElement('script');
                                    Array.from(oldScript.attributes).forEach(attr => {
                                        newScript.setAttribute(attr.name, attr.value);
                                    });
                                    newScript.textContent = oldScript.textContent;
                                    document.body.appendChild(newScript);
                                });

                                if (item.credit) {
                                    const creditEl = document.createElement('p');
                                    creditEl.innerHTML = item.credit;
                                    creditEl.className = 'g-credit';
                                    wrapper.appendChild(creditEl);
                                }
                            })
                            .catch(error => {
                                wrapper.innerHTML = '<p>Error loading embed.</p>';
                            });
                        container.appendChild(wrapper);
                        lastHeadlineWrapper = null;
                        break;    
                    default:
                        lastHeadlineWrapper = null;
                        break;
                }
            });
            
            window.dispatchEvent(new Event('scroll'));
        })
        .catch(error => console.error('Error fetching project data:', error));
}