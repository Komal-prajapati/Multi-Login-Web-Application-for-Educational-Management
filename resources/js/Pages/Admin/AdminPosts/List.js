import { Fragment, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { Menu, Transition } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { CardHeader, Avatar, Checkbox } from '@mui/material';
import { Link } from '@inertiajs/inertia-react';
import ReadMore from '@/Components/ReadMore';
import Select from 'react-select';
import { AdminOwnPostExpand } from '@/Components/Expand';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { AdminPostLikes } from '@/Components/AdminPostLikes';
import ApiService from '@/services/ApiService';
import { Inertia } from '@inertiajs/inertia';
import Images from '@/Components/Images';
import 'react-image-lightbox/style.css';

export default function List(props) {
  const [inputText, setInputText] = useState('');
  const inputHandler = (e) => {
    setInputText(e.label.toLowerCase());
  };
  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [allMedia, setMedia] = useState(0);


  const media = (media) => {
    setMedia(media);
  };

  const callIndex = (index) => {
    setImgIndex(index);
  };

  const deletePost = (e, post) => {
    e.preventDefault();
    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to delete this class post? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Delete',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(route('admin.adminposts.destroy', post.id)).then((response) => {
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });
          Inertia.reload({ props });
        });
      }
    });
  };

  const filteredData = props.rows.filter((el) => {
    if (inputText === '') {
      return el;
    }
    if(el.class !== null){
      return el.class.name.toLowerCase().includes(inputText);
    }
    if(el.class === null){
      if(inputText === "all classes"){
        return el;
      }
    }
    
  });

  const fetchLikeData = (event) => {
    ApiService.post(route('admin.adminposts.likes', [event.target.value, event.target.checked]))
      .then(() => {
        Inertia.reload(props.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [selectedTeacherPostForLikes, setSelectedTeacherPostForLikes] = useState(null);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const callbackModal = () => {
    setIsPostOpen(false);
    setIsOpen(false);
  };
  const openLikePostModal = (post, e) => {
    e.preventDefault();
    setSelectedTeacherPostForLikes(post);
    setIsPostOpen(true);
  };

  const openPostLikeModal = (post) => (
    <AdminPostLikes post={post} closeModel={callbackModal} modulePanel="admin" />
  );

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Admins Posts'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col md:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Admin&apos;s posts</h6>
                  <div className="ml-0 md:ml-6 mt-1 md:mt-0 w-full md:w-auto">
                    <Select options={props.classes} name="classes_id" onChange={inputHandler}></Select>
                  </div>
                </div>

                <Link
                  href={route('admin.adminposts.create')}
                  className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                >
                  Add New Class Post
                </Link>
              </div>
            </div>

            <div className="w-100 overflow-x-auto">
              <ul className="relative flex-row items-start pt-6 bg-gray-200 rounded-lg border-0 imageList">
                {filteredData.map((post, index) => (
                  <li className="profile mb-6" key={index}>
                    <div className={'relative item-center m-0 md:m-2 bg-white rounded-xl shadow-lg md:max-w-xl'}>
                      <div className="flex justify-between">
                        <span className="top-0 inline-flex items-center justify-center px-2 py-1 text-sm font-semibold leading-none text-blue-600 bg-blue-100 rounded-b">
                          Class Name: {post.class ? post.class.name : "All Classes"}
                        </span>
                      </div>
                      <CardHeader
                        avatar={
                          <span className="relative flex items-center no-underline w-18 h-12 rounded-full bg-white">
                            {props.auth.profilePicture ? (
                              <Avatar
                                alt="Placeholder"
                                className="bg-yellow-500 w-12 h-12 block rounded-full"
                                src={props.auth.profilePicture}
                              />
                            ) : (
                              <Avatar className="bg-yellow-500">{props.auth.user.first_name.charAt(0)}</Avatar>
                            )}

                            <div className="flex flex-wrap flex-col lg:flex-row items-start justify-start">
                              <p className="ml-2 text-sm font-semibold capitalize">
                                {`${props.auth.user.first_name} ${props.auth.user.last_name}`}{' '}
                              </p>
                              <div className="ml-2 text-gray-500 text-sm">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                  hour12: false,
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </div>
                            </div>
                          </span>
                        }
                        action={
                          <Menu as="div" className="relative inline-block">
                            <div className="">
                              <Menu.Button className="bg-white rounded-2xl focus:outline-white hover:bg-blue-600 hover:text-white text-gray-500 font-semibold m-1 p-1">
                                <MoreHoriz />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute w-24 top-0 right-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                                <div className="py-1">
                                  {post.status !== 'approved' && (
                                    <Menu.Item>
                                      <Link
                                        href={route('admin.adminposts.edit', post.id)}
                                        params="profile"
                                        method="get"
                                        className="text-sm py-2 px-4 bg-transparent font-semibold block text-black-800 hover:text-blue-600 hover:bg-blue-100"
                                      >
                                        Edit
                                      </Link>
                                    </Menu.Item>
                                  )}
                                  <Menu.Item>
                                    <Link
                                      href=""
                                      onClick={(e) => deletePost(e, post)}
                                      method="delete"
                                      className="text-sm py-2 px-4 bg-transparent font-semibold block text-black-800 hover:text-blue-600 hover:bg-blue-100"
                                    >
                                      Delete
                                    </Link>
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        }
                      />
                      <div className="p-3">
                        <ReadMore>{post.content}</ReadMore>
                      </div>

                      <div className="">
                        {post.media.length > 1 ? (
                          <>
                            <div className="grid grid-cols-2">
                              {post.thumb_url.slice(0, 4).map((photo, index) => (
                                <>
                                  <div className="relative custom-popup-hover" key={index}>
                                    <button
                                     className='image-size-small w-full'
                                      onClick={() => {
                                        setIsOpen(true);
                                        setImgIndex(index);
                                        media(post.media);
                                      }}
                                    >
                                      <img src={photo} className="max-w-full h-auto" alt="" />
                                    </button>
                                    {index == 3 && post.media.length - 4 !== 0 && (
                                    <div className="overlay">
                                      <button
                                        onClick={() => {
                                          setIsOpen(true);
                                          setImgIndex(index);
                                          media(post.media);
                                        }}
                                        className="number"
                                      >
                                        {post.media.length - 4}+
                                      </button>
                                    </div>
                                  )}
                                  </div>
                                </>
                              ))}
                            </div>
                          </>
                        ) : (
                          [
                            post.media.length ? (
                              <div className="mb-4">
                                <button
                                  onClick={() => {
                                    setIsOpen(true);
                                    setImgIndex(0);
                                    media(post.media);
                                  }}
                                >
                                  <img src={post.thumb_url[0]} className="w-full h-auto rounded-lg" alt="" />
                                </button>
                              </div>
                            ) : null,
                          ]
                        )}
                      </div>
                      <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                        <div className="flex items-center flex-wrap p-0 w-full">

                          {post.likes.length ? (
                            <Checkbox
                              value={post.id}
                              icon={<FavoriteBorder />}
                              checkedIcon={<Favorite className="fill-pink" />}
                              name="checkedH"
                              className="checked fill-pink"
                              checked={true}
                              onClick={fetchLikeData}
                            />
                          ) : (
                            <Checkbox
                              value={post.id}
                              icon={<FavoriteBorder />}
                              checkedIcon={<Favorite />}
                              name="checkedH"
                              className="checked"
                              checked={false}
                              onClick={fetchLikeData}
                            />
                          )}

                          {(post.likes_count == 1 && (
                            <button
                              onClick={(e) => openLikePostModal(post, e)}
                              className="hover:text-gray-400 text-black text-sm md:text-base"
                            >
                              {post.likes_count} like
                            </button>
                          )) ||
                            (post.likes_count > 1 && (
                              <button
                                onClick={(e) => openLikePostModal(post, e)}
                                className="hover:text-gray-400 text-black text-sm md:text-base"
                              >
                                {post.likes_count} likes
                              </button>
                            ))}
                          <AdminOwnPostExpand
                            postId={post.id}
                            value={props.students}
                            valueOne={post.comments_count}
                            modulePanel="admin"
                            isFriday=""
                          >
                            {post.id}
                          </AdminOwnPostExpand>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {filteredData.length == 0 && <p className="text-xl text-center m-24">No Posts Yet :(</p>}
              {isPostOpen ? openPostLikeModal(selectedTeacherPostForLikes) : null}
              {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
