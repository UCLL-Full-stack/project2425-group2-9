import { CustomerInput } from "@/types"


type Props = {

    customer : CustomerInput
}

const CustomerDetails: React.FC<Props> = ({customer}: Props) => {

    return (
        <>

        { customer &&
            <table>
                <tbody>
            <tr>
              <td>ID:</td>
              <td>{customer.id}</td>
            </tr>
            <tr>
              <td>FirstName:</td>
              <td>{customer.firstName}</td>
            </tr>
            <tr>
              <td>Lastname:</td>
              <td>{customer.lastName}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>{customer.role}</td>
            </tr>
            <tr>
              <td>Username:</td>
              <td>{customer.username}</td>
            </tr>
            <tr>
                <td>Role:</td>
                <td>{customer.role}</td>
            </tr>
          </tbody>
            </table>

            
        }
        </>
    )
}