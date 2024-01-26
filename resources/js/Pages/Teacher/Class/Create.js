import Authenticated from '@/Layouts/Authenticated';
import { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';

export default function Create(props) {
  const { data, setData, reset } = useForm({
    name: '',
    track_id: '',
    description: '',
    teacher_ids:[],
  });

  const [teacher,setTeacher] = useState([]);
  const [errors, setErrors] = useState([]);
  const [teacheroptions, setTeacherOptions] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };
  const onTeachersHandleChange = (selected) => {
    setData('teacher_ids',selected);
  };
  const fetchTeacher = async (e) => {
    setData('track_id', e.value);
    return await axios.get(route('teacher.classes.fetchTeacher',[`${e.value}`])).then((res) => {
      setTeacherOptions(res.data.teachers);
      return res.data.data;
    });
  };
  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);
    axios
      .post(route('teacher.classes.store'), data)
      .then((response) => {
        setProcessing(false);
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          window.history.back();
          setErrors([]);

          reset();
          document.getElementById('formCreateClass').reset();
          document.getElementById('textarea').value = '';
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Classes'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-3/5">
          <form onSubmit={submit} id="formCreateClass">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Add New Class</h6>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600  border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all   "
                      processing={processing}
                    >
                      Add
                    </Button>
                    <Link
                      href={route('teacher.classes')}
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-auto px-4 lg:px-6 py-10 pt-0">
                <div className="flex flex-wrap space-y-4">
                  <div className="w-full lg:w-6/12 px-4 mt-4">
                    <Label forInput="name" value="Name" required={true} />

                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={data.name}
                      className="mt-1 block w-full"
                      handleChange={onHandleChange}
                    />

                    {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <Label forInput="track_id" value="Select Track" required={true} />

                    <Select
                      options={props.tracks}
                      id="track_id"
                      name="track_id"
                      className="mt-1"
                      onChange={fetchTeacher}
                    />

                    {errors.track_id && <div className="text-sm text-red-600">{errors.track_id}</div>}
                  </div>

                  <div className="w-full px-4">
                    <Label forInput="description" value="Description" required={true} />

                    <textarea
                      name="description"
                      id="description"
                      defaultValue={data.description}
                      className="mt-1 block w-full py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 resize-none"
                      onChange={onHandleChange}
                    ></textarea>

                    {errors.description && <div className="text-sm text-red-600">{errors.description}</div>}
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <Label forInput="track_id" value="Select Teachers" required={true} />

                    <Select
                      options={props.teachers}
                      id="teacher_ids"
                      name="teacher_ids[]"
                      className="mt-1"
                      onChange={(e) => {
                        onTeachersHandleChange(e);
                        setTeacher(e.value);
                      }}
                      isMulti
                    />
                    {errors.teacher_ids && <div className="text-sm text-red-600">{errors.teacher_ids}</div>}
                  </div>

                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
